import { registerBlock } from "@reactioncommerce/reaction-components";
import { registerOperatorRoute } from "/imports/client/ui";
import EmailTemplateSettingsRegion from "./components/EmailTemplateSettingsRegion";
import { getReactComponentOrBlazeTemplate } from "/imports/plugins/core/components/lib/ReactComponentOrBlazeTemplate";

import "./templates/settings.html";
import "./templates/settings.js";

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
  component: () => getReactComponentOrBlazeTemplate("templateSettings"),
  priority: 1
});
