
import React from "react";
import LinkIcon from "mdi-material-ui/LinkVariant";
import { registerOperatorRoute } from "/imports/client/ui";
import ContentViewFullLayout from "/imports/client/ui/layouts/ContentViewFullLayout";
import NavigationDashboard from "./containers/navigationDashboardContainer";
import "./containers";

registerOperatorRoute({
  isNavigationLink: true,
  isSetting: false,
  priority: 50,
  LayoutComponent: ContentViewFullLayout,
  MainComponent: NavigationDashboard,
  path: "/navigation",
  // eslint-disable-next-line react/display-name
  SidebarIconComponent: (props) => <LinkIcon {...props} />,
  sidebarI18nLabel: "admin.navigation.navigation"
});
