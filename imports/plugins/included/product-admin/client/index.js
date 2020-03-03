import "./templates/productAdmin.html";
import "./templates/productAdmin.js";
import "./blocks";

import React from "react";
import CubeIcon from "mdi-material-ui/Cube";
import { registerOperatorRoute } from "/imports/client/ui";

import ProductsTable from "./components/ProductsTable";
import ProductDetailLayout from "./layouts/ProductDetail";
import VariantDetail from "./layouts/VariantDetail";
import ContentViewExtraWideLayout from "/imports/client/ui/layouts/ContentViewExtraWideLayout";

// HOCs
import withProduct from "./hocs/withProduct";
import withVariant from "./hocs/withVariant";

// Register routes
registerOperatorRoute({
  path: "/products/:handle/:parentVariantId/:variantId",
  MainComponent: VariantDetail,
  hocs: [
    withProduct,
    withVariant
  ]
});

registerOperatorRoute({
  path: "/products/:handle/:variantId",
  MainComponent: VariantDetail,
  hocs: [
    withProduct,
    withVariant
  ]
});

registerOperatorRoute({
  path: "/products/:handle",
  MainComponent: ProductDetailLayout,
  hocs: [withProduct]
});

registerOperatorRoute({
  group: "navigation",
  priority: 20,
  LayoutComponent: ContentViewExtraWideLayout,
  path: "/products",
  MainComponent: ProductsTable,
  // eslint-disable-next-line react/display-name, react/no-multi-comp
  SidebarIconComponent: (props) => <CubeIcon {...props} />,
  sidebarI18nLabel: "admin.products"
});
