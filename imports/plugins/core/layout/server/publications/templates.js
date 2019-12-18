import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Counts } from "meteor/tmeasday:publish-counts";
import Reaction from "/imports/plugins/core/core/server/Reaction";
import { Templates } from "/lib/collections";

Meteor.publish("Templates", function (_, __) {
  // These checks are to avoid errors from the audit-argument-checks package
  check(_, Match.Maybe(Object));
  check(__, Match.Maybe(Object));
  const shopId = Reaction.getShopId();

  Counts.publish(this, "templates-count", Templates.find({ shopId }));

  return Templates.find({ shopId });
});
