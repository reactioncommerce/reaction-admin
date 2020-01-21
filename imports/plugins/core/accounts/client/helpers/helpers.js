import React from "react";
import { Accounts } from "meteor/accounts-base";
import * as Collections from "/lib/collections";
import { Components } from "@reactioncommerce/reaction-components";

/**
 * @method getUserAvatar
 * @memberof Accounts
 * @summary ReactionAvatar Component helper to get a user's Avatar
 * @example const userAvatar = getUserAvatar(account);
 * @param  {Object} currentUser User
 * @returns {Component}          ReactionAvatar component
 */
export function getUserAvatar(currentUser) {
  const user = currentUser || Accounts.user();

  const account = Collections.Accounts.findOne(user._id);
  // first we check picture exists. Picture has higher priority to display
  if (account && account.profile && account.profile.picture) {
    const { picture } = account.profile;

    return (
      <Components.ReactionAvatar
        className={"accounts-avatar"}
        size={30}
        src={picture}
      />
    );
  }
  if (user.emails && user.emails.length === 1) {
    const email = user.emails[0].address;

    return (
      <Components.ReactionAvatar
        className={"accounts-avatar"}
        email={email}
        size={30}
      />
    );
  }

  return (
    <Components.ReactionAvatar
      className={"accounts-avatar"}
      size={30}
    />
  );
}
