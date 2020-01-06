import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import * as Collections from "/lib/collections";
import { Components } from "@reactioncommerce/reaction-components";

const { passwordChangeUrl = "" } = Meteor.settings.public;

/**
 * @method isOwnerOfProfile
 * @memberof Accounts
 * @summary checks whether or not the user viewing this profile is also
 * its owner.
 * @since 1.5.0
 * @returns {Boolean} - whether or not the current user is also this
 * profile's owner.
 */
function isOwnerOfProfile() {
  const targetUserId = Reaction.Router.getQueryParam("userId");
  const loggedInUserId = Reaction.getUserId();
  return targetUserId === undefined || targetUserId === loggedInUserId;
}

/**
 * @method getTargetAccount
 * @memberof Accounts
 * @summary gets the account of the userId in the route, or the current user.
 * @since 1.5.0
 * @returns {Object} - the account of the identified user.
 */
function getTargetAccount() {
  const targetUserId = Reaction.Router.getQueryParam("userId") || Reaction.getUserId();
  const account = Collections.Accounts.findOne({ userId: targetUserId });

  return account;
}

Template.accountProfile.onCreated(() => {
  // hide actionView if open, doesn't relate to profile page
  Reaction.hideActionView();
});

Template.accountProfile.helpers({
  /**
   * @method doesUserExist
   * @summary confirms that a given userId belongs to an existing user.
   * @since 1.5.0
   * @returns {Boolean} - whether or not a user with a given ID exists.
   * @ignore
   */
  doesUserExist() {
    const targetUserId = Reaction.Router.getQueryParam("userId");
    if (!targetUserId) {
      // If userId isn't in this route's query parameters, then a user
      // is viewing his/her own profile.
      return true;
    }
    const targetUser = Collections.Accounts.findOne({ userId: targetUserId });
    return targetUser !== undefined;
  },

  /**
   * @method isOwnerOfProfile
   * @summary checks whether or not the user viewing this profile is also
   * its owner.
   * @since 1.5.0
   * @returns {Boolean} - whether or not the current user is also this profile's owner.
   * @ignore
   */
  isOwnerOfProfile() {
    return isOwnerOfProfile();
  },

  /**
   * @method UpdateEmail
   * @summary returns a component for updating a user's email.
   * @since 1.5.0
   * @returns {Object} - contains the component for updating a user's email.
   * @ignore
   */
  UpdateEmail() {
    return {
      component: Components.UpdateEmail
    };
  },

  /**
   * @method ReactionAvatar
   * @summary returns a component that displays a user's avatar.
   * @since 1.5.0
   * @returns {Object} - contains the component that displays a user's avatar.
   * @ignore
   */
  ReactionAvatar() {
    const account = Collections.Accounts.findOne({ userId: Reaction.getUserId() });
    if (account && account.profile && account.profile.picture) {
      const { picture } = account.profile;
      return {
        component: Components.ReactionAvatar,
        currentUser: true,
        src: picture
      };
    }
    return {
      component: Components.ReactionAvatar,
      currentUser: true
    };
  },

  /**
   * @method displayName
   * @summary returns the name of a user.
   * @since 1.5.0
   * @returns {String} - the name of a given user.
   * @ignore
   */
  displayName() {
    const account = getTargetAccount();

    if (account) {
      if (account.name) {
        return account.name;
      } else if (account.username) {
        return account.username;
      } else if (account.profile && account.profile.name) {
        return account.profile.name;
      }
    }

    return null;
  },

  /**
   * @method displayEmail
   * @summary returns a user's email.
   * @since 1.5.0
   * @returns {String} - the email of a given user.
   * @ignore
   */
  displayEmail() {
    const account = getTargetAccount();

    if (account && Array.isArray(account.emails)) {
      const defaultEmail = account.emails.find((email) => email.provides === "default");
      return (defaultEmail && defaultEmail.address) || account.emails[0].address;
    }

    return null;
  },

  changePasswordUrl() {
    const account = getTargetAccount();

    let email = "";
    if (account && Array.isArray(account.emails)) {
      const defaultEmail = account.emails.find((em) => em.provides === "default");
      email = (defaultEmail && defaultEmail.address) || account.emails[0].address || "";
    }

    return passwordChangeUrl.replace("EMAIL", encodeURIComponent(email)).replace("FROM", encodeURIComponent(document.location.href));
  }
});
