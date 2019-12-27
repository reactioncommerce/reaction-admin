import React from "react";
import AccountIcon from "mdi-material-ui/AccountMultiple";

import { registerOperatorRoute, registerRoute } from "/imports/client/ui";
import Accounts from "./containers/accountsDashboardContainer";
import Login from "./components/login";

export { default as AccountsDashboard } from "./components/accountsDashboard";
export { default as AdminInviteForm } from "./components/adminInviteForm";
export { default as EditGroup } from "./components/editGroup";
export { default as ForgotPassword } from "./components/forgotPassword";
export { default as GroupForm } from "./components/groupForm";
export { default as GroupHeader } from "./components/groupHeader";
export { default as GroupsTable } from "./components/groupsTable";
export { default as GroupsTableButton } from "./components/groupsTableButton";
export { default as GroupsTableCell } from "./components/groupsTableCell";
export { default as Login } from "./components/login";
export { default as LoginButtons } from "./components/loginButtons";
export { default as LoginFormMessages } from "./components/loginFormMessages";
export { default as ManageGroups } from "./components/manageGroups";
export { default as PermissionsList } from "./components/permissionsList";
export { default as SignIn } from "./components/signIn";
export { default as SignUp } from "./components/signUp";
export { default as UpdateEmail } from "./containers/updateEmail";
export { default as UpdatePassword } from "./components/updatePassword";

export { default as AccountsDashboardContainer } from "./containers/accountsDashboardContainer";
export { default as UserOrdersListContainer } from "./containers/userOrdersListContainer";
export { default as AuthContainer } from "./containers/auth";
export { default as EditGroupContainer } from "./containers/editGroupContainer";
export { default as ForgotPasswordContainer } from "./containers/forgotPassword";
export { default as MessagesContainer } from "./containers/messages";
export { default as UpdatePasswordContainer } from "./containers/updatePassword";
export { default as VerifyAccount } from "./containers/verifyAccount";

import "./templates/accounts.html";

import "./templates/dashboard/dashboard.html";
import "./templates/dashboard/dashboard.js";
import "./templates/dropdown/helpers";
import "./templates/login/loginForm.html";
import "./templates/login/loginForm.js";
import "./templates/members/member.html";
import "./templates/members/member.js";
import "./templates/profile/profile.html";
import "./templates/profile/profile.js";
import "./templates/profile/userOrdersList.html";
import "./templates/profile/userOrdersList.js";
import "./templates/updatePassword/updatePassword.html";
import "./templates/updatePassword/updatePassword.js";

const ENROLL_URI_BASE = "account/enroll";

registerOperatorRoute({
  isNavigationLink: true,
  isSetting: false,
  path: "/accounts",
  priority: 40,
  mainComponent: Accounts,
  // eslint-disable-next-line react/display-name, react/no-multi-comp
  SidebarIconComponent: (props) => <AccountIcon {...props} />,
  sidebarI18nLabel: "admin.dashboard.accountsLabel"
});

registerOperatorRoute({
  isNavigationLink: false,
  isSetting: false,
  path: "/profile",
  mainComponent: "accountProfile"
});

registerRoute({
  path: "/account/profile/verify",
  mainComponent: "loginFormUpdatePassword"
});

registerRoute({
  path: "/reset-password/:token/:status?",
  mainComponent: Login
});

registerRoute({
  path: `/${ENROLL_URI_BASE}/:token/:status?`,
  mainComponent: Login
});

registerRoute({
  path: "/account/invite",
  mainComponent: Login
});
