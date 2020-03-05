import { registerOperatorRoute } from "/imports/client/ui";
import { registerBlock } from "@reactioncommerce/reaction-components";
import EmailSettingsRegion from "./components/EmailSettingsRegion";
import EmailSettings from "./containers/EmailSettings";

registerOperatorRoute({
  group: "settings",
  path: "/settings/email",
  MainComponent: EmailSettingsRegion,
  priority: 150,
  sidebarI18nLabel: "admin.dashboard.emailLabel"
});

registerBlock({
  component: EmailSettings,
  name: "EmailSettingsGeneral",
  priority: 1,
  region: "EmailSettings"
});
