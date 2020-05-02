import React from "react";
import AccountIcon from "mdi-material-ui/AccountMultiple";

import { registerOperatorRoute } from "/imports/client/ui";

import Accounts from "./components/Accounts";

export { default as UpdateEmail } from "./containers/updateEmail";
export { default as VerifyAccount } from "./containers/verifyAccount";

import "./templates/profile/profile.html";
import "./templates/profile/profile.js";

registerOperatorRoute({
  group: "navigation",
  path: "/accounts",
  priority: 40,
  MainComponent: Accounts,
  // eslint-disable-next-line react/display-name, react/no-multi-comp
  SidebarIconComponent: (props) => <AccountIcon {...props} />,
  sidebarI18nLabel: "admin.accounts.accountsLabel"
});

registerOperatorRoute({
  path: "/profile",
  MainComponent: "accountProfile"
});
