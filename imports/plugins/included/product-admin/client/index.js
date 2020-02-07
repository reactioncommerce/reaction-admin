import "./templates/productAdmin.html";
import "./templates/productAdmin.js";
import "./blocks";

import React from "react";
import CubeIcon from "mdi-material-ui/Cube";
import { registerOperatorRoute } from "/imports/client/ui";

import ProductsTable from "./components/ProductsTable";
import ProductDetailLayout from "./layouts/ProductDetail";
import ContentViewExtraWideLayout from "/imports/client/ui/layouts/ContentViewExtraWideLayout";
import ContentViewFullLayout from "/imports/client/ui/layouts/ContentViewFullLayout";

registerOperatorRoute({
  isNavigationLink: false,
  isSetting: false,
  layoutComponent: ContentViewFullLayout,
  path: "/products/:handle/:variantId?/:optionId?",
  mainComponent: ProductDetailLayout
});

registerOperatorRoute({
  isNavigationLink: true,
  isSetting: false,
  priority: 20,
  layoutComponent: ContentViewExtraWideLayout,
  path: "/products",
  mainComponent: ProductsTable,
  // eslint-disable-next-line react/display-name, react/no-multi-comp
  SidebarIconComponent: (props) => <CubeIcon {...props} />,
  sidebarI18nLabel: "admin.products"
});
