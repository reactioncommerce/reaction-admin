import { Meteor } from "meteor/meteor";
import { Shops } from "/lib/collections";

Meteor.publish("PrimaryShop", () => Shops.find({
  shopType: "primary"
}, {
  limit: 1
}));

Meteor.publish("UserShop", () => {
  const { profile } = Meteor.users.findOne(Meteor.userId(), { fields: { profile: 1 } });
  const shopId = profile &&
    profile.preferences &&
    profile.preferences.reaction &&
    profile.preferences.reaction.activeShopId;

  return Shops.find({ _id: shopId });
});
