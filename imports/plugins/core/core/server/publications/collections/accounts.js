import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Roles } from "meteor/alanning:roles";
import * as Collections from "/lib/collections";
import Reaction from "/imports/plugins/core/core/server/Reaction";

/**
 * accounts
 */

Meteor.publish("Accounts", function () {
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
Meteor.publish("MyAccount", () => {
  const userId = Reaction.getUserId();
  if (!userId) return this.ready();

  return Collections.Accounts.find({ userId });
});

/**
 * Single account
 * @param {String} userId -  id of user to find
 */
Meteor.publish("UserAccount", function (userId) {
  check(userId, Match.OneOf(String, null));

  const shopId = Reaction.getShopId();
  if (Roles.userIsInRole(this.userId, ["admin", "owner"], shopId)) {
    return Collections.Accounts.find({
      userId
    });
  }
  return this.ready();
});

/**
 * userProfile
 * @deprecated since version 0.10.2
 * get any user name,social profile image
 * should be limited, secure information
 * users with permissions  ["dashboard/orders", "owner", "admin", "dashboard/
 * customers"] may view the profileUserId"s profile data.
 *
 */
Meteor.publish("UserProfile", function () {
  const userId = Reaction.getUserId();
  if (!userId) return this.ready();

  // no need to normal user so see his password hash
  const fields = {
    "emails": 1,
    "name": 1,
    "profile.lang": 1,
    "profile.firstName": 1,
    "profile.lastName": 1,
    "profile.familyName": 1,
    "profile.secondName": 1,
    "profile.name": 1,
    "services.twitter.profile_image_url_https": 1,
    "services.facebook.id": 1,
    "services.google.picture": 1,
    "services.github.username": 1,
    "services.instagram.profile_picture": 1
  };

  return Meteor.users.find({
    _id: this.userId
  }, {
    fields
  });
});
