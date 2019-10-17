import _ from "lodash";
import getOpaqueIds from "/imports/plugins/core/core/client/util/getOpaqueIds";
import simpleGraphQLClient from "/imports/plugins/core/graphql/lib/helpers/simpleClient";
import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";
import { Reaction } from "/client/api";
import { ReactiveDict } from "meteor/reactive-dict";

Template.paymentSettings.onCreated(async function () {
  this.state = new ReactiveDict();
  this.state.setDefault({ paymentMethods: [], shopId: null });

  this.autorun(async () => {
    const shopId = Reaction.getShopId();
    if (!shopId) {
      this.state.set({ paymentMethods: [], shopId: null });
      return;
    }

    const [opaqueShopId] = await getOpaqueIds([{ namespace: "Shop", id: shopId }]);
    const { paymentMethods } = await simpleGraphQLClient.queries.paymentMethods({ shopId: opaqueShopId });
    this.state.set({ paymentMethods, shopId: opaqueShopId });
  });

  this.autorun(async () => {
    const shopId = Reaction.getShopId();
    if (shopId) {
      this.subscribe("Packages", shopId);
    }
  });
});

Template.paymentSettings.helpers({
  paymentPlugins() {
    const plugins = Reaction.Apps({ provides: "paymentSettings" });

    // Omit discounts, which we have a separate template for
    return plugins.filter(({ packageName }) => packageName !== "discount-codes");
  },
  paymentMethodsForPlugin() {
    const paymentMethods = Template.instance().state.get("paymentMethods");
    if (!Array.isArray(paymentMethods)) return [];

    return paymentMethods.filter((method) => method.pluginName === this.packageName);
  }
});

// toggle payment methods visibility
Template.paymentSettings.events({
  async "change input[name=paymentMethodEnabled]"(event) {
    event.preventDefault();

    const { state } = Template.instance();
    const isEnabled = event.target.checked;

    const response = await simpleGraphQLClient.mutations.enablePaymentMethodForShop({
      input: {
        shopId: state.get("shopId"),
        paymentMethodName: this.name,
        isEnabled
      }
    });
    const paymentMethods = _.get(response, "enablePaymentMethodForShop.paymentMethods");
    state.set("paymentMethods", paymentMethods);
  }
});

// Handle legacy discount codes payment method
Template.discountsPaymentSettings.helpers({
  checked(enabled) {
    if (enabled === true) {
      return "checked";
    }
    return "";
  },
  shown(enabled) {
    if (enabled !== true) {
      return "hidden";
    }
    return "";
  }
});

Template.discountsPaymentSettings.events({
  "change input[name=enabled]"(event) {
    event.preventDefault();

    const isEnabled = event.target.checked;
    const fields = [{
      property: "enabled",
      value: isEnabled
    }];

    Meteor.call("registry/update", this.packageId, this.settingsKey, fields);
    Meteor.call("shop/togglePackage", this.packageId, !isEnabled);
  }
});
