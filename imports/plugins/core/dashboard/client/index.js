import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";

import { registerBlock } from "@reactioncommerce/reaction-components";
import { registerOperatorRoute } from "/imports/client/ui";
import OperatorLanding from "/imports/plugins/core/dashboard/client/components/OperatorLanding";
import ContentViewPirimaryDetailLayout from "/imports/client/ui/layouts/ContentViewPrimaryDetailLayout";

// Settings link list
import SettingsList from "./components/SettingsList";
import ShopSettingsRegion from "./components/ShopSettingsRegion";

// Settings
import SystemInformation from "./components/SystemInformation";
import ShopLogoUrls from "./components/ShopLogoUrls";
import SettingsDashboard from "./components/SettingsDashboard";
import ShopSettingsForm from "./components/ShopSettingsForm";
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
  path: "/",
  MainComponent: OperatorLanding
});

registerOperatorRoute({
  group: "navigation",
  priority: 10,
  path: "/settings",
  LayoutComponent: ContentViewPirimaryDetailLayout,
  MainComponent: SettingsDashboard,
  // eslint-disable-next-line react/display-name
  SidebarIconComponent: (props) => <FontAwesomeIcon icon={faStore} {...props} />,
  sidebarI18nLabel: "admin.settings.generalSettingsLabel"
});

registerOperatorRoute({
  group: "settings",
  MainComponent: SystemInformation,
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
  component: ShopSettingsForm,
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
