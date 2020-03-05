import { registerBlock } from "@reactioncommerce/reaction-components";
import { registerOperatorRoute } from "/imports/client/ui";
import TaxSettingsRegion from "./components/TaxSettingsRegion";
import TaxSettings from "./components/TaxSettings";

registerOperatorRoute({
  group: "settings",
  MainComponent: TaxSettingsRegion,
  priority: 130,
  path: "/settings/tax-settings",
  sidebarI18nLabel: "admin.dashboard.taxesLabel"
});

registerBlock({
  component: TaxSettings,
  name: "GeneralTaxSettings",
  priority: 1,
  region: "TaxSettings"
});


