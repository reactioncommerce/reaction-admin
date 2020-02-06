import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";

import { registerBlock } from "/imports/plugins/core/components/lib";
import { registerOperatorRoute } from "/imports/client/ui";
import OperatorLanding from "/imports/plugins/core/dashboard/client/components/OperatorLanding";

import SystemInformation from "./components/SystemInformation";
import ShopLogoUrls from "./components/ShopLogoUrls";
import Settings from "./components/Settings";
import GeneralSettings from "./components/GeneralSettings";
import AddressSettings from "./components/AddressSettings";

import StorefrontUrls from "./components/StorefrontUrls";

import "./components/shopBrandImageOption";
import "./components/ShopBrandMediaManager";
import "./containers/CreateFirstShopForm.js";

import "./templates/shop/settings/settings.html";
import "./templates/shop/settings/settings.less";
import "./templates/shop/settings/settings.js";


// Default landing page
registerOperatorRoute({
  isNavigationLink: false,
  isSetting: false,
  path: "/",
  mainComponent: OperatorLanding
});

registerOperatorRoute({
  isNavigationLink: true,
  isSetting: true,
  priority: 10,
  path: "/shop-settings",
  mainComponent: Settings,
  // eslint-disable-next-line react/display-name
  SidebarIconComponent: (props) => <FontAwesomeIcon icon={faStore} {...props} />,
  sidebarI18nLabel: "admin.settings.shopSettingsLabel"
});

registerOperatorRoute({
  isNavigationLink: true,
  isSetting: true,
  mainComponent: SystemInformation,
  path: "/system",
  priority: 1000,
  sidebarI18nLabel: "shopSettings.systemInfo.title"
});

registerBlock({
  region: "ShopSettings",
  name: "GeneralSettings",
  component: GeneralSettings,
  priority: 1
});

registerBlock({
  region: "ShopSettings",
  name: "AddressSettings",
  component: AddressSettings,
  priority: 2
});

registerBlock({
  region: "ShopSettings",
  name: "ShopLogoUrls",
  component: ShopLogoUrls,
  priority: 3
});

registerBlock({
  region: "ShopSettings",
  name: "StorefrontUrls",
  component: StorefrontUrls,
  priority: 4
});
