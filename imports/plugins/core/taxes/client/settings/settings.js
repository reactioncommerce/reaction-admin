import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import GeneralTaxSettings from "../containers/GeneralTaxSettings";

Template.taxSettings.onCreated(async function () {
  this.autorun(async () => {
    const shopId = Reaction.getShopId();
    if (shopId) {
      this.subscribe("Packages", shopId);
    }
  });
});

Template.taxSettings.helpers({
  GeneralTaxSettings() {
    return GeneralTaxSettings;
  }
});
