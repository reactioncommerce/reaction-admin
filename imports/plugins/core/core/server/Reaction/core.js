import { URL } from "url";
import Logger from "@reactioncommerce/logger";
import _ from "lodash";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import * as Collections from "/lib/collections";
import ConnectionDataStore from "/imports/plugins/core/core/server/util/connectionDataStore";
import config from "../config.js";
import { getUserId } from "./accountUtils";

/**
 * @file Server core methods
 *
 * @namespace Core
 */

// Unpack the named Collections we use.
const { Groups, Shops, Accounts: AccountsCollection } = Collections;

export default {
  /**
   * @summary Called to indicate that startup is done, causing all
   *   `onAppStartupComplete` callbacks to run in series.
   * @returns {undefined}
   */
  async emitAppStartupComplete() {
    if (this.appStartupIsComplete) return;
    this.appStartupIsComplete = true;
    if (this.onAppStartupCompleteCallbacks) {
      for (const callback of this.onAppStartupCompleteCallbacks) {
        await callback(this.reactionNodeApp); // eslint-disable-line no-await-in-loop
      }
      this.onAppStartupCompleteCallbacks = [];
    }
  },

  /**
   * @summary Register a function to be called once after the app startup is
   *   fully done running.
   * @param {Function} callback Function to call after app startup, which might be immediately
   * @returns {undefined}
   */
  onAppStartupComplete(callback) {
    if (this.appStartupIsComplete) {
      callback(this.reactionNodeApp);
    } else {
      if (!this.onAppStartupCompleteCallbacks) this.onAppStartupCompleteCallbacks = [];
      this.onAppStartupCompleteCallbacks.push(callback);
    }
  },

  defaultCustomerRoles: ["guest", "account/profile", "product", "tag", "index", "cart/completed"],
  defaultVisitorRoles: ["anonymous", "guest", "product", "tag", "index", "cart/completed"],

  /**
   * @name hasPermission
   * @method
   * @memberof Core
   * @summary server permissions checks hasPermission exists on both the server and the client.
   * @param {String | Array} checkPermissions -String or Array of permissions if empty, defaults to "admin, owner"
   * @param {String} userId - userId, defaults to logged in userId
   * @param {String} checkGroup group - default to shopId
   * @returns {Boolean} Boolean - true if has permission
   */
  hasPermission(checkPermissions, userId = getUserId(), checkGroup = this.getShopId()) {
    // check(checkPermissions, Match.OneOf(String, Array)); check(userId, String); check(checkGroup,
    // Match.Optional(String));
    const GLOBAL_GROUP = "__global_roles__";
    let permissions;
    // default group to the shop or global if shop isn't defined for some reason.
    let group;
    if (checkGroup !== undefined && typeof checkGroup === "string") {
      group = checkGroup;
    } else {
      group = this.getShopId() || GLOBAL_GROUP;
    }

    // permissions can be either a string or an array we'll force it into an array and use that
    if (checkPermissions === undefined) {
      permissions = ["owner"];
    } else if (typeof checkPermissions === "string") {
      permissions = [checkPermissions];
    } else {
      permissions = checkPermissions;
    }

    // if the user has admin, owner permissions we'll always check if those roles are enough
    permissions.push("owner");
    permissions = _.uniq(permissions);

    // Groups that a user belongs to are saved on the `account` object, not the `user` object
    const account = AccountsCollection.findOne({
      userId
    });

    let accountPermissions;
    if (account && Array.isArray(account.groups)) {
      const user = Meteor.user();
      // set __global_roles__ from the user
      accountPermissions = { __global_permissions__: (user && user.roles && user.roles.__global_roles__) || [] }; // eslint-disable-line camelcase

      // get all groups that this user belongs to
      const groups = Groups.find({ _id: { $in: account.groups } }).fetch();
      // get unique shops from groups (there may be multiple groups from one shop)
      const allShopIds = groups.map((grp) => grp.shopId);
      const uniqueShopIds = _.uniq(allShopIds);

      // get all groups for shop
      // flatten all group arrays into a single array
      // remove duplicate permissions
      // set permissions array with shopId as key on accountPermissions object
      uniqueShopIds.forEach((shopId) => {
        const groupPermissionsForShop = groups.filter((grp) => grp.shopId === shopId).map((grp) => grp.permissions);
        const flattenedGroupPermissionsForShop = _.flattenDeep(groupPermissionsForShop);
        const uniquePermissionsForShop = _.uniq(flattenedGroupPermissionsForShop);
        accountPermissions[shopId] = uniquePermissionsForShop;
      });
    }

    // if accountPermissions includes any of checkPermissions, then we return true
    return accountPermissions[group] && accountPermissions[group].some((permission) => checkPermissions.includes(permission));
  },

  /**
   * @name hasAdminAccess
   * @method
   * @memberof Core
   * @returns {Boolean} Boolean - true if has permission
   */
  hasAdminAccess() {
    return true; // permission checks will be done on the server
  },

  /**
   * @name hasDashboardAccess
   * @method
   * @memberof Core
   * @returns {Boolean} Boolean - true if has permission
   */
  hasDashboardAccess() {
    return true; // permission checks will be done on the server
  },

  /**
   * @name getPrimaryShop
   * @summary Get the first created shop. In marketplace, the Primary Shop is the shop that controls the marketplace
   * and can see all other shops
   * @method
   * @memberof Core
   * @returns {Object} Shop
   */
  getPrimaryShop() {
    const primaryShop = Shops.findOne({
      shopType: "primary"
    });

    return primaryShop;
  },

  /**
   * @name getPrimaryShopId
   * @summary Get the first created shop ID. In marketplace, the Primary Shop is the shop that controls the marketplace
   * and can see all other shops
   * @method
   * @memberof Core
   * @returns {String} ID
   */
  getPrimaryShopId() {
    const primaryShop = this.getPrimaryShop();

    if (!primaryShop) { return null; }

    return primaryShop._id;
  },

  /**
   * @name getPrimaryShopName
   * @method
   * @summary Get primary shop name or empty string
   * @memberof Core
   * @returns {String} Return shop name or empty string
   */
  getPrimaryShopName() {
    const primaryShop = this.getPrimaryShop();
    if (primaryShop) {
      return primaryShop.name;
    }
    return "";
  },

  /**
   * @name getPrimaryShopPrefix
   * @summary Get primary shop prefix for URL
   * @memberof Core
   * @method
   * @todo Primary Shop should probably not have a prefix (or should it be /shop?)
   * @returns {String} Prefix in the format of "/<slug>"
   */
  getPrimaryShopPrefix() {
    return `/${this.getSlug(this.getPrimaryShopName().toLowerCase())}`;
  },

  /**
   * @name getShopId
   * @method
   * @memberof Core
   * @summary Get shop ID, first by checking the current user's preferences
   * then by getting the shop by the current domain.
   * @todo should we return the Primary Shop if none found?
   * @returns {String} active shop ID
   */
  getShopId() {
    // is there a stored value?
    let shopId = ConnectionDataStore.get("shopId");

    // if so, return it
    if (shopId) {
      return shopId;
    }

    try {
      // otherwise, find the shop by user settings
      shopId = this.getUserShopId(getUserId());
    } catch (_e) {
      // an error when invoked outside of a method
      // call or publication, i.e., at startup. That's ok here.
    }

    // if still not found, look up the shop by domain
    if (!shopId) {
      shopId = this.getShopIdByDomain();
    }

    // use the primary shop id by default
    if (!shopId) {
      shopId = this.getPrimaryShopId();
    }

    // store the value for faster responses
    ConnectionDataStore.set("shopId", shopId);

    return shopId;
  },

  /**
   * @name clearCache
   * @method
   * @memberof Core
   * @summary allows the client to trigger an uncached lookup of the shopId.
   *          this is useful when a user switches shops.
   * @returns {undefined}
   */
  resetShopId() {
    ConnectionDataStore.clear("shopId");
  },

  /**
   * @name isShopPrimary
   * @summary Whether the current shop is the Primary Shop (vs a Merchant Shop)
   * @method
   * @memberof Core
   * @returns {Boolean} whether shop is flagged as primary
   */
  isShopPrimary() {
    return this.getShopId() === this.getPrimaryShopId();
  },

  /**
   * @name getShopIdByDomain
   * @method
   * @memberof Core
   * @summary searches for a shop which should be used given the current domain
   * @returns {StringId} shopId
   */
  getShopIdByDomain() {
    const parsedUrl = new URL(config.ROOT_URL);
    const domain = parsedUrl.hostname;
    const primaryShop = this.getPrimaryShop();

    // in cases where the domain could match multiple shops, we first check
    // whether the primaryShop matches the current domain. If so, we give it
    // priority
    if (primaryShop && Array.isArray(primaryShop.domains) && primaryShop.domains.includes(domain)) {
      return primaryShop._id;
    }

    const shop = Shops.find({
      domains: domain
    }, {
      limit: 1,
      fields: {
        _id: 1
      }
    }).fetch()[0];

    return shop && shop._id;
  },

  /**
   * @name getUserShopId
   * @method
   * @memberof Core
   * @summary Get a user's shop ID, as stored in preferences
   * @param {String} userId (probably logged in userId)
   * @returns {String} active shop ID
   */
  getUserShopId(userId) {
    check(userId, String);

    const user = AccountsCollection.findOne({ _id: userId });
    if (!user) return null;

    return _.get(user, "profile.preferences.reaction.activeShopId");
  },

  /**
   * @summary Method for getting all schemas attached to a given collection
   * @deprecated by simpl-schema
   * @private
   * @name collectionSchema
   * @param  {string} collection The mongo collection to get schemas for
   * @param  {Object} [selector] Optional selector for multi schema collections
   * @returns {Object} Returns a simpleSchema that is a combination of all schemas
   *                  that have been attached to the collection or false if
   *                  the collection or schema could not be found
   */
  collectionSchema(collection, selector) {
    Logger.warn("Reaction.collectionSchema is deprecated and will be removed" +
      " in a future release. Use collection.simpleSchema(selector).");

    const selectorErrMsg = selector ? `and selector ${selector}` : "";
    const errMsg = `Reaction.collectionSchema could not find schemas for ${collection} collection ${selectorErrMsg}`;

    const col = Collections[collection];
    if (!col) {
      Logger.warn(errMsg);
      // Return false so we don't pass a check that uses a non-existent schema
      return false;
    }

    const schema = col.simpleSchema(selector);
    if (!schema) {
      Logger.warn(errMsg);
      // Return false so we don't pass a check that uses a non-existent schema
      return false;
    }

    return schema;
  }
};
