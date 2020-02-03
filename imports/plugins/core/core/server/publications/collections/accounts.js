import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import * as Collections from "/lib/collections";
import Reaction from "/imports/plugins/core/core/server/Reaction";

/**
 * accounts
 */

Meteor.publish("Accounts", function publishAccounts() {
  const userId = Reaction.getUserId();
  const GLOBAL_GROUP = "__global_roles__";

  if (!userId) {
    return this.ready();
  }

  const shopId = Reaction.getShopId();
  if (!shopId) {
    return this.ready();
  }

  const nonAdminGroups = Collections.Groups.find({
    name: { $in: ["guest", "customer"] },
    shopId
  }, {
    fields: { _id: 1 }
  }).fetch().map((group) => group._id);

  // global admin can get all accounts
  if (Reaction.hasPermission(["owner"], userId, GLOBAL_GROUP)) {
    return Collections.Accounts.find({
      groups: { $nin: nonAdminGroups }
    });

  // shop admin gets accounts for just this shop
  } else if (Reaction.hasPermission(["reaction:legacy:accounts/read"], userId, shopId)) {
    return Collections.Accounts.find({
      groups: { $nin: nonAdminGroups },
      shopId
    });
  }

  // regular users should get just their account
  return Collections.Accounts.find({ userId });
});

/**
 * Own account
 */
Meteor.publish("MyAccount", function publishMyAccount() {
  const userId = Reaction.getUserId();
  if (!userId) return this.ready();

  return Collections.Accounts.find({ userId });
});

/**
 * Single account
 * @param {String} userId -  id of user to find
 */
Meteor.publish("UserAccount", function publishUserAccount(userId) {
  check(userId, Match.OneOf(String, null));

  const shopId = Reaction.getShopId();
  if (Reaction.hasPermission(["owner", "admin"], this.userId, shopId)) {
    return Collections.Accounts.find({
      userId
    });
  }
  return this.ready();
});
