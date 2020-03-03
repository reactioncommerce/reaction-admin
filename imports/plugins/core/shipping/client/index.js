import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShippingFast } from "@fortawesome/free-solid-svg-icons";

import { registerOperatorRoute } from "/imports/client/ui";
import Shipping from "./components/Shipping";

registerOperatorRoute({
  group: "settings",
  MainComponent: Shipping,
  priority: 40,
  path: "/shipping",
  // eslint-disable-next-line react/display-name
  SidebarIconComponent: (props) => <FontAwesomeIcon icon={faShippingFast} {...props} />,
  sidebarI18nLabel: "admin.dashboard.shippingLabel"
});
