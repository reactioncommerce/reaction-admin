import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import ContentViewExtraWideLayout from "/imports/client/ui/layouts/ContentViewExtraWideLayout";

import { registerBlock } from "@reactioncommerce/reaction-components";
import { registerOperatorRoute } from "/imports/client/ui";
import OperatorLanding from "/imports/plugins/core/dashboard/client/components/OperatorLanding";

// Settings link list
import SettingsList from "./components/SettingsList";
import ShopSettingsRegion from "./components/ShopSettingsRegion";

// Settings
import SystemInformation from "./components/SystemInformation";
import ShopLogoUrls from "./components/ShopLogoUrls";
import SettingsMain from "./components/SettingsMain";
import ShopSettings from "./components/ShopSettings";
import ShopAddressSettings from "./components/ShopAddressSettings";

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
  isNavigationLink: false,
  isSetting: false,
  priority: 10,
  path: "/settings/:setting?",
  layoutComponent: ContentViewExtraWideLayout,
  mainComponent: SettingsMain,
  // eslint-disable-next-line react/display-name
  SidebarIconComponent: (props) => <FontAwesomeIcon icon={faStore} {...props} />,
  sidebarI18nLabel: "admin.settings.generalSettingsLabel"
});

registerOperatorRoute({
  isNavigationLink: true,
  isSetting: true,
  mainComponent: SystemInformation,
  path: "/system",
  priority: 1000,
  sidebarI18nLabel: "shopSettings.systemInfo.title"
});

// Settings Sidebar blocks
registerBlock({
  region: "SettingsSidebar",
  name: "GeneralSettingsList",
  component: SettingsList
});

// Shop settings region
registerOperatorRoute({
  isNavigationLink: true,
  isSetting: true,
  mainComponent: ShopSettingsRegion,
  priority: 10,
  path: "/settings/shop",
  sidebarI18nLabel: "admin.settings.shopSettingsLabel"
});

// Settings blocks
registerBlock({
  region: "ShopSettings",
  name: "ShopSettingsGeneral",
  component: ShopSettings,
  priority: 1
});

registerBlock({
  region: "ShopSettings",
  name: "ShopAddress",
  component: ShopAddressSettings,
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
