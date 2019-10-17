import { Meteor } from "meteor/meteor";
import { Counts } from "meteor/tmeasday:publish-counts";
import Reaction from "/imports/plugins/core/core/server/Reaction";
import { Templates } from "/lib/collections";

Meteor.publish("Templates", function () {
  const shopId = Reaction.getShopId();

  Counts.publish(this, "templates-count", Templates.find({ shopId }));

  return Templates.find({ shopId });
});
