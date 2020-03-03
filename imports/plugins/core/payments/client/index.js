import { registerOperatorRoute } from "/imports/client/ui";
import { registerBlock } from "@reactioncommerce/reaction-components";
import PaymentSettings from "./PaymentSettings";

registerOperatorRoute({
  group: "settings",
  MainComponent: PaymentSettings,
  priority: 20,
  path: "/settings/payment",
  sidebarI18nLabel: "admin.settings.paymentSettingsLabel"
});

registerBlock({
  region: "PaymentSettings",
  name: "PaymentSettingsDefault",
  component: PaymentSettings,
  priority: 1
});
