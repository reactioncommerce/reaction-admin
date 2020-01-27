import addUserPermissions from "./addUserPermissions";
import getUserId from "./getUserId";
import groupMethods from "./group";
import setActiveShopId from "./setActiveShopId";
import setUserPermissions from "./setUserPermissions";
import updateEmailAddress from "./updateEmailAddress";
import verifyAccount from "./verifyAccount";

/**
 * @file Extends Meteor's {@link https://github.com/meteor/meteor/tree/master/packages/accounts-base Accounts-Base}
 * with methods for Reaction-specific behavior and user interaction. Run these methods using: `Meteor.call()`
 * @example Meteor.call("accounts/verifyAccount", email, token)
 * @namespace Accounts/Methods
 */

/**
 * @file Meteor methods for Reaction
 *
 *
 * @namespace Reaction/Methods
*/

export default {
  "accounts/addUserPermissions": addUserPermissions,
  "accounts/setActiveShopId": setActiveShopId,
  "accounts/setUserPermissions": setUserPermissions,
  "accounts/updateEmailAddress": updateEmailAddress,
  "accounts/verifyAccount": verifyAccount,
  "reaction/getUserId": getUserId,
  ...groupMethods
};
