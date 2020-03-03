import { registerOperatorRoute } from "/imports/client/ui";
import { registerBlock } from "@reactioncommerce/reaction-components";
import PaymentSettingsRegion from "./PaymentSettingsRegion";
import PaymentSettings from "./PaymentSettings";

registerOperatorRoute({
  group: "settings",
  MainComponent: PaymentSettingsRegion,
  priority: 120,
  path: "/settings/payment",
  sidebarI18nLabel: "admin.settings.paymentSettingsLabel"
});

registerBlock({
  region: "PaymentSettings",
  name: "PaymentSettings",
  component: PaymentSettings,
  priority: 1
});
