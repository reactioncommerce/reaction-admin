import { registerOperatorRoute } from "/imports/client/ui";
import AddressValidationSettingsRegion from "./components/AddressValidationSettingsRegion";
import ShopAddressValidationSettings from "./containers/ShopAddressValidationSettings";
import { registerBlock } from "@reactioncommerce/reaction-components";

registerOperatorRoute({
  group: "settings",
  MainComponent: AddressValidationSettingsRegion,
  path: "/settings/address-validation-settings",
  priority: 170,
  sidebarI18nLabel: "addressValidation.title"
});

registerBlock({
  region: "AddressValidationSettings",
  name: "AddressValidationSettings",
  component: ShopAddressValidationSettings,
  priority: 1
});
