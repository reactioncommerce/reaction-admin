import OAuthFormContainer from "./containers/auth";
import { registerRoute } from "/imports/client/ui";

registerRoute({
  path: "/account/login",
  mainComponent: OAuthFormContainer
});
