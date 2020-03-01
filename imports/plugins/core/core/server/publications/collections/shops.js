import { Meteor } from "meteor/meteor";
import { Accounts, Groups, Shops } from "/lib/collections";

Meteor.publish("PrimaryShop", () => Shops.find({
  shopType: "primary"
}, {
  limit: 1
}));

Meteor.publish("UserShops", () => {
  const primaryShop = Shops.findOne({
    shopType: "primary"
  });

  const userProfile = Accounts.findOne({ userId: Meteor.userId() });
  const groupIds = userProfile.groups;

  const groups = Groups.find({ _id: { $in: groupIds }});

  const shopIds = groups.map((group) => {
    if (group.slug === "owner" && group.shopId !== null) {
      return group.shopId;
    }
  });

  shopIds.push(primaryShop._id);
  
  return Shops.find({ _id: { $in: shopIds }});
});
