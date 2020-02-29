import { registerOperatorRoute } from "/imports/client/ui";
import { registerBlock } from "@reactioncommerce/reaction-components";
import PaymentSettingsRegion from "./PaymentSettingsRegion";
import PaymentSettings from "./PaymentSettings";

registerOperatorRoute({
  isNavigationLink: true,
  isSetting: true,
  mainComponent: PaymentSettingsRegion,
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
