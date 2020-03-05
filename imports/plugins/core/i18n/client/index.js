import { registerOperatorRoute } from "/imports/client/ui";
import { registerBlock } from "@reactioncommerce/reaction-components";
import LocalizationSettingsRegion from "./components/LocalizationSettingsRegion";
import Localization from "./containers/localizationSettings";

export { default as LocalizationSettings } from "./containers/localizationSettings";

registerOperatorRoute({
  group: "settings",
  MainComponent: LocalizationSettingsRegion,
  path: "/settings/localization",
  sidebarI18nLabel: "admin.i18nSettings.shopLocalization",
  priority: 160
});

registerBlock({
  component: Localization,
  name: "LocalizationSettingsGeneral",
  priority: 1,
  region: "LocalizationSettings"
});
