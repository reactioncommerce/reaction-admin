import _ from "lodash";
import { Components } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Roles } from "meteor/alanning:roles";
import { Reaction } from "/client/api";
import * as Collections from "/lib/collections";

Template.accountsDashboard.onCreated(function () {
  this.autorun(() => {
    this.subscribe("ShopMembers");
  });
});

Template.accountsDashboard.helpers({
  /**
   * isShopMember
   * @returns {Boolean} True if the memnber is an administrator
   * @ignore
   */
  isShopMember() {
    return _.includes(["dashboard", "admin", "owner"], this.role);
  },

  /**
   * isShopGuest
   * @returns {Boolean} True if the member is a guest
   * @ignore
   */
  isShopGuest() {
    return !_.includes(["dashboard", "admin", "owner"], this.role);
  },
  /**
   * members
   * @returns {Boolean} True array of adminsitrative members
   * @ignore
   */
  members() {
    if (Reaction.hasPermission("reaction-accounts")) {
      const shopId = Reaction.getShopId();
      const instance = Template.instance();
      if (instance.subscriptionsReady()) {
        const shopUsers = Meteor.users.find();

        return shopUsers.map((user) => {
          const member = {};

          // Querying the Accounts collection to retrieve user's name because
          // Meteor filters out sensitive info from the Meteor.users schema
          const userSub = Meteor.subscribe("UserAccount", user._id);
          if (userSub.ready()) {
            member.name = Collections.Accounts.findOne(user._id).name;
          }
          member.userId = user._id;

          if (user.emails && user.emails.length) {
            // this is some kind of denormalization. It is helpful to have both
            // of this string and array. Array goes to avatar, string goes to
            // template
            member.emails = user.emails;
            member.email = user.emails[0].address;
          }
          // member.user = user;
          member.username = user.username;
          member.isAdmin = Roles.userIsInRole(user._id, "admin", shopId);
          member.roles = user.roles;
          member.services = user.services;

          if (Roles.userIsInRole(member.userId, "owner", shopId)) {
            member.role = "owner";
          } else if (Roles.userIsInRole(member.userId, "admin", shopId)) {
            member.role = "admin";
          } else if (Roles.userIsInRole(member.userId, "dashboard", shopId)) {
            member.role = "dashboard";
          } else if (Roles.userIsInRole(member.userId, "guest", shopId)) {
            member.role = "guest";
          }

          return member;
        });
      }
    }

    return null;
  },

  accountsDashboard() {
    return Components.AccountsDashboard;
  }
});
