import { registerBlock } from "@reactioncommerce/reaction-components";
import { registerOperatorRoute } from "/imports/client/ui";
import ShippingSettingsRegion from "./components/ShippingSettingsRegion";
import ShippingSettings from "./components/ShippingSettings";

registerOperatorRoute({
  group: "settings",
  MainComponent: ShippingSettingsRegion,
  priority: 140,
  path: "/settings/shipping",
  sidebarI18nLabel: "admin.dashboard.shippingLabel"
});

registerBlock({
  component: ShippingSettings,
  name: "GeneralShippingSettings",
  priority: 1,
  region: "ShippingSettings"
});
