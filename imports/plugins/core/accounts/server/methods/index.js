import setActiveShopId from "./setActiveShopId";
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
  "accounts/setActiveShopId": setActiveShopId,
  "accounts/updateEmailAddress": updateEmailAddress,
  "accounts/verifyAccount": verifyAccount
};
