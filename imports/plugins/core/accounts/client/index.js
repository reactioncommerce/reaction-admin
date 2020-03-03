import React from "react";
import AccountIcon from "mdi-material-ui/AccountMultiple";

import { registerOperatorRoute } from "/imports/client/ui";
import Accounts from "./containers/accountsDashboardContainer";

export { default as AccountsDashboard } from "./components/accountsDashboard";
export { default as AdminInviteForm } from "./components/adminInviteForm";
export { default as EditGroup } from "./components/editGroup";
export { default as GroupForm } from "./components/groupForm";
export { default as GroupHeader } from "./components/groupHeader";
export { default as GroupsTable } from "./components/groupsTable";
export { default as GroupsTableButton } from "./components/groupsTableButton";
export { default as GroupsTableCell } from "./components/groupsTableCell";
export { default as ManageGroups } from "./components/manageGroups";
export { default as PermissionsList } from "./components/permissionsList";
export { default as UpdateEmail } from "./containers/updateEmail";

export { default as AccountsDashboardContainer } from "./containers/accountsDashboardContainer";
export { default as EditGroupContainer } from "./containers/editGroupContainer";
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
  sidebarI18nLabel: "admin.dashboard.accountsLabel"
});

registerOperatorRoute({
  path: "/profile",
  MainComponent: "accountProfile"
});
