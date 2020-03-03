import React from "react";
import InboxIcon from "mdi-material-ui/Inbox";
import { registerBlock } from "@reactioncommerce/reaction-components";
import { registerOperatorRoute } from "/imports/client/ui";
import ContentViewExtraWideLayout from "/imports/client/ui/layouts/ContentViewExtraWideLayout";
import { Shop } from "/imports/collections/schemas";
import OrderCardSummary from "./components/OrderCardSummary";
import Orders from "./components/OrdersTable";
import Order from "./containers/OrderContainer";
import OrderPrint from "./containers/OrderPrintContainer";
import "./helpers";

Shop.extend({
  orderStatusLabels: {
    type: Object,
    blackbox: true,
    optional: true
  }
});

// Register order related routes
/*
 * Single order page route
 */
registerOperatorRoute({
  MainComponent: Order,
  path: "/orders/:_id"
});

/*
 * Single order print layout route
 */
registerOperatorRoute({
  MainComponent: OrderPrint,
  path: "/orders/print/:_id"
});

/*
 * Orders table route
 */
registerOperatorRoute({
  group: "navigation",
  priority: 10,
  LayoutComponent: ContentViewExtraWideLayout,
  MainComponent: Orders,
  path: "/orders",
  // eslint-disable-next-line react/display-name
  SidebarIconComponent: (props) => <InboxIcon {...props} />,
  sidebarI18nLabel: "admin.dashboard.ordersLabel"
});


// Register order related blocks
/*
 * OrderCardSummary
 */
registerBlock({
  region: "OrderCardSummary",
  name: "OrderCardSummary",
  component: OrderCardSummary,
  priority: 10
});
