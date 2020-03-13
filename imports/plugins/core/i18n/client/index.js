import { registerOperatorRoute } from "/imports/client/ui";
import { registerBlock } from "@reactioncommerce/reaction-components";
import LocalizationSettingsRegion from "./components/LocalizationSettingsRegion";
import LocalizationSettingsForm from "./components/LocalizationSettingsForm";

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
