import { registerOperatorRoute } from "/imports/client/ui";
import ShopAddressValidationSettings from "./containers/ShopAddressValidationSettings";

registerOperatorRoute({
  isNavigationLink: true,
  isSetting: true,
  mainComponent: ShopAddressValidationSettings,
  path: "/address-validation-settings",
  priority: 900,
  sidebarI18nLabel: "addressValidation.title"
});
