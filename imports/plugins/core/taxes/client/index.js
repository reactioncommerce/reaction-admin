import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUniversity } from "@fortawesome/free-solid-svg-icons";
import { registerOperatorRoute } from "/imports/client/ui";
import TaxSettings from "./components/TaxSettings";

registerOperatorRoute({
  isNavigationLink: true,
  isSetting: true,
  mainComponent: TaxSettings,
  priority: 30,
  path: "/tax-settings",
  // eslint-disable-next-line react/display-name
  SidebarIconComponent: (props) => <FontAwesomeIcon icon={faUniversity} {...props} />,
  sidebarI18nLabel: "admin.dashboard.taxesLabel"
});
