import { SubsManager } from "meteor/meteorhacks:subs-manager";

export const Subscriptions = {};

// Subscription Manager
// See: https://github.com/kadirahq/subs-manager
Subscriptions.Manager = new SubsManager();

/**
 * General Subscriptions
 */

Subscriptions.BrandAssets = Subscriptions.Manager.subscribe("BrandAssets");
Subscriptions.Groups = Subscriptions.Manager.subscribe("Groups");
Subscriptions.MyAccount = Subscriptions.Manager.subscribe("MyAccount");
Subscriptions.PrimaryShop = Subscriptions.Manager.subscribe("PrimaryShop");
