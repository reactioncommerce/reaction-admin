import { registerOperatorRoute } from "/imports/client/ui";
import { registerBlock } from "@reactioncommerce/reaction-components";
import LocalizationSettingsRegion from "./components/LocalizationSettingsRegion";
import Localization from "./containers/localizationSettings";
import LocalizationSettingsForm from "./components/LocalizationSettingsForm";

export { default as LocalizationSettings } from "./containers/localizationSettings";

registerOperatorRoute({
  group: "settings",
  MainComponent: LocalizationSettingsRegion,
  path: "/settings/localization",
  sidebarI18nLabel: "admin.i18nSettings.shopLocalization",
  priority: 160
});

registerBlock({
  component: LocalizationSettingsForm,
  name: "LocalizationSettings",
  priority: 1,
  region: "LocalizationSettings"
});

registerBlock({
  component: Localization,
  name: "LocalizationSettingsGeneral",
  priority: 2,
  region: "LocalizationSettings"
});
