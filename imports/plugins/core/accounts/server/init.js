import _ from "lodash";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import ReactionError from "@reactioncommerce/reaction-error";
import * as Collections from "/lib/collections";

Meteor.startup(() => {
  /**
   * Make sure initial admin user has verified their
   * email before allowing them to login.
   *
   * http://docs.meteor.com/#/full/accounts_validateloginattempt
   */

  Accounts.validateLoginAttempt((attempt) => {
    if (!attempt.allowed) {
      return false;
    }

    // confirm this is the accounts-password login method
    if (attempt.type !== "password" || attempt.methodName !== "login") {
      return attempt.allowed;
    }

    if (!attempt.user) {
      return attempt.allowed;
    }

    const loginEmail = attempt.methodArguments[0].user.email;
    const adminEmail = process.env.REACTION_EMAIL;

    if (loginEmail && loginEmail === adminEmail) {
      // filter out the matching login email from any existing emails
      const userEmail = _.filter(attempt.user.emails, (email) => email.address === loginEmail);

      // check if the email is verified
      if (!userEmail.length || !userEmail[0].verified) {
        throw new ReactionError("access-denied", "Oops! Please validate your email first.");
      }
    }

    return attempt.allowed;
  });

  /**
   * Accounts.onCreateUser event
   * adding either a guest or anonymous role to the user on create
   * adds Accounts record for reaction user profiles
   * we clone the user into accounts, as the user collection is
   * only to be used for authentication.
   * - defaultVisitorRole
   * - defaultRoles
   * can be overridden from Shops
   *
   * @see: http://docs.meteor.com/#/full/accounts_oncreateuser
   */
  Accounts.onCreateUser((options, user) => {
    const roles = {};
    const profile = { ...((options && options.profile) || {}) };
    if (!user.name) user.name = options && options.name;
    if (!user.emails) user.emails = [];

    // Figure out what initial shop this user is signing up for
    let { shopId } = options || {};
    if (!shopId) {
      const primaryShop = Collections.Shops.findOne({ shopType: "primary" });
      if (primaryShop) {
        shopId = primaryShop._id;
      }
    }

    // If there is not yet an "owner" user, make this one an owner
    const ownerUser = Meteor.users.findOne({ "roles.__global_roles__": "owner" });
    if (!ownerUser) roles.__global_roles__ = ["owner"]; // eslint-disable-line camelcase

    if (shopId) {
      const group = Collections.Groups.findOne({ slug: "customer", shopId });
      if (group && group.permissions) {
        roles[shopId] = group && group.permissions;
      }
    }

    // also add services with email defined to user.emails[]
    const userServices = user.services;
    for (const service in userServices) {
      if ({}.hasOwnProperty.call(userServices, service)) {
        const serviceObj = userServices[service];
        if (serviceObj.email) {
          const email = {
            provides: "default",
            address: serviceObj.email,
            verified: true
          };
          user.emails.push(email);
        }
        if (serviceObj.name) {
          user.username = serviceObj.name;
          profile.name = serviceObj.name;
        }
        // TODO: For now we have here instagram, twitter and google avatar cases
        // need to make complete list
        if (serviceObj.picture) {
          profile.picture = user.services[service].picture;
        } else if (serviceObj.profile_image_url_https) {
          profile.picture = user.services[service].dprofile_image_url_https;
        } else if (serviceObj.profile_picture) {
          profile.picture = user.services[service].profile_picture;
        }
        // Correctly map Instagram profile data to Meteor user / Accounts
        if (userServices.instagram) {
          user.username = serviceObj.username;
          user.name = serviceObj.full_name;
          profile.picture = serviceObj.profile_picture;
          profile.bio = serviceObj.bio;
          profile.name = serviceObj.full_name;
        }
      }
    }

    if (user.username) profile.username = user.username;

    // Automatically verify "localhost" email addresses
    if (user.emails[0] && user.emails[0].address.indexOf("localhost") > -1) {
      user.emails[0].verified = true;
    }

    // assign default user roles
    user.roles = roles;

    return user;
  });
});
