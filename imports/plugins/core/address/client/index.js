import { registerOperatorRoute } from "/imports/client/ui";
import ShopAddressValidationSettings from "./containers/ShopAddressValidationSettings";

registerOperatorRoute({
  group: "settings",
  MainComponent: ShopAddressValidationSettings,
  path: "/address-validation-settings",
  priority: 900,
  sidebarI18nLabel: "addressValidation.title"
});
