import { registerBlock } from "@reactioncommerce/reaction-components";
import SMTPEmailConfig from "./containers/SMTPEmailConfigContainer";
import "./containers/SMTPEmailSettingsContainer";

registerBlock({
  region: "EmailSettings",
  name: "SMTPEmailConfig",
  component: SMTPEmailConfig,
  priority: 1
});
