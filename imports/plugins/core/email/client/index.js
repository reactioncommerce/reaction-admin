import { registerOperatorRoute } from "/imports/client/ui";
import { registerBlock } from "@reactioncommerce/reaction-components";
import EmailSettingsRegion from "./components/EmailSettingsRegion";
import EmailTable from "./components/EmailTable";

registerOperatorRoute({
  group: "settings",
  path: "/settings/email",
  MainComponent: EmailSettingsRegion,
  priority: 150,
  sidebarI18nLabel: "admin.dashboard.emailLabel"
});

registerBlock({
  component: EmailTable,
  name: "EmailSettingsGeneral",
  priority: 1,
  region: "EmailSettings"
});
