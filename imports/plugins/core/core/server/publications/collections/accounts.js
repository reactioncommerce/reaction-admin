import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Roles } from "meteor/alanning:roles";
import * as Collections from "/lib/collections";
import Reaction from "/imports/plugins/core/core/server/Reaction";

/**
 * accounts
 */

Meteor.publish("Accounts", function publishAccounts() {
  const userId = Reaction.getUserId();

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
  if (Roles.userIsInRole(userId, ["owner"], Roles.GLOBAL_GROUP)) {
    return Collections.Accounts.find({
      groups: { $nin: nonAdminGroups }
    });

  // shop admin gets accounts for just this shop
  } else if (Roles.userIsInRole(userId, ["admin", "owner", "reaction-accounts"], shopId)) {
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
  if (Roles.userIsInRole(this.userId, ["admin", "owner"], shopId)) {
    return Collections.Accounts.find({
      userId
    });
  }
  return this.ready();
});
