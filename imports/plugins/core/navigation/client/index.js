
import React from "react";
import LinkIcon from "mdi-material-ui/LinkVariant";
import { registerOperatorRoute } from "/imports/client/ui";
import NavigationDashboard from "./containers/navigationDashboardContainer";
import "./containers";

registerOperatorRoute({
  group: "navigation",
  priority: 50,
  // Use no layout. NavigationDashboard uses ContentViewPrimaryDetailLayout inside itself.
  LayoutComponent: null,
  MainComponent: NavigationDashboard,
  path: "/navigation",
  // eslint-disable-next-line react/display-name
  SidebarIconComponent: (props) => <LinkIcon {...props} />,
  sidebarI18nLabel: "admin.navigation.navigation"
});
