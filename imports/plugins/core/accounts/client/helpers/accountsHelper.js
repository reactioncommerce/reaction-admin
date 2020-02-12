import _ from "lodash";
import { Reaction } from "/client/api";
import * as Collections from "/lib/collections";

/**
 * @method sortUsersIntoGroups
 * @memberof Accounts
 * @summary helper - client puts each full user object into an array on the group they belong
 * @param {Array} accounts - list of user account objects
 * @param {Array} groups - list of permission groups
 * @returns {Array} - array of groups, each having a `users` field
 */
export default function sortUsersIntoGroups({ accounts, groups }) {
  const newGroups = groups.map((group) => {
    const matchingAccounts = accounts.filter((acc) => acc.groups && acc.groups.indexOf(group._id) > -1);
    group.users = _.compact(matchingAccounts);
    return group;
  });
  const accountsWithoutGroup = accounts.filter((acc) => !acc.groups || acc.groups.length === 0);
  if (accountsWithoutGroup.length) {
    newGroups.push({
      name: "Not In Any Group",
      slug: "_none",
      users: accountsWithoutGroup
    });
  }
  return newGroups;
}

/**
 * @method sortGroups
 * @memberof Accounts
 * @summary Sort to display higher permission groups and "owner" at the top
 * @param  {Array} groups [description]
 * @returns {Array}        [description]
 */
export function sortGroups(groups) {
  return groups.sort((prev, next) => {
    if (next.slug === "owner") { return 1; } // owner tops
    return next.permissions.length - prev.permissions.length;
  });
}

/**
 * @method getInvitableGroups
 * @memberof Accounts
 * @summary helper - client This generates a list of groups the user can invite to.
 * It filters out the owner group (because you cannot invite directly to an existing shop as owner)
 * It also filters out groups that the user does not have needed permissions to invite to.
 * All these are also checked by the Meteor method, so this is done to prevent trying to invite and getting error
 * @param {Array} groups - list of user account objects
 * @returns {Array} - array of groups or empty object
 */
export function getInvitableGroups(groups) {
  return groups || [];
}

/**
 * @method getDefaultUserInviteGroup
 * @memberof Accounts
 * @summary user's default invite groups is the group they belong
 * if the user belongs to owner group, it defaults to shop manager (because you cannot invite directly
 * to an existing shop as owner). If no match still, use the first of the groups passed
 * (e.g in case of Marketplace owner accessing a merchant shop)
 * @param  {Array} groups [description]
 * @returns {Object}        [description]
 */
export function getDefaultUserInviteGroup(groups) {
  let result;
  const user = Collections.Accounts.findOne({ userId: Reaction.getUserId() });
  result = groups.find((grp) => user && user.groups.indexOf(grp._id) > -1);

  if (result && result.slug === "owner") {
    result = groups.find((grp) => grp.slug === "shop manager");
  }

  if (!result) {
    result = groups.find((firstGroup) => firstGroup);
  }

  return result;
}

/**
 * @method getUserByEmail
 * @memberOf Accounts
 * @summary Returns a user that matches the email address
 * @param {String} email email address
 * @returns {Object} account of user from provided email address
 */
export function getUserByEmail(email) {
  return Collections.Accounts.findOne({ "emails.address": email });
}
