import { registerBlock } from "@reactioncommerce/reaction-components";
import { registerOperatorRoute } from "/imports/client/ui";
import EmailTemplateSettingsRegion from "./components/EmailTemplateSettingsRegion";
import EmailTemplateTable from "./components/EmailTemplateTable";

registerOperatorRoute({
  group: "settings",
  path: "/settings/templates",
  MainComponent: EmailTemplateSettingsRegion,
  sidebarI18nLabel: "admin.settings.templateSettingsLabel",
  priority: 190
});

registerBlock({
  region: "EmailTemplateSettings",
  name: "EmailTemplateSettingsGeneral",
  component: EmailTemplateTable,
  priority: 1
});
