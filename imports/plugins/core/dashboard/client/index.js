import SettingsIcon from "mdi-material-ui/Settings";
import { registerBlock } from "@reactioncommerce/reaction-components";
import { registerOperatorRoute } from "/imports/client/ui";
import OperatorLanding from "/imports/plugins/core/dashboard/client/components/OperatorLanding";

// Settings block regions
import ShopSettingsRegion from "./components/ShopSettingsRegion";
import SystemSettingsRegion from "./components/SystemSettingsRegion";

// Settings
import SettingsDashboard from "./components/SettingsDashboard";
import ShopAddressSettings from "./components/ShopAddressSettings";
import ShopLogoUrls from "./components/ShopLogoUrls";
import ShopSettingsForm from "./components/ShopSettingsForm";
import StorefrontUrls from "./components/StorefrontUrls";
import SystemInformation from "./components/SystemInformation";

import "./components/shopBrandImageOption";
import "./components/ShopBrandMediaManager";
import "./containers/CreateFirstShopForm.js";

// Default landing page
registerOperatorRoute({
  path: "/",
  MainComponent: OperatorLanding
});

registerOperatorRoute({
  group: "navigation",
  priority: 80,
  path: "/settings/:setting?",
  href: "/settings/shop",
  LayoutComponent: null,
  MainComponent: SettingsDashboard,
  // eslint-disable-next-line react/display-name
  SidebarIconComponent: SettingsIcon,
  sidebarI18nLabel: "admin.settings.settingsLabel"
});

// Shop settings region
registerOperatorRoute({
  group: "settings",
  MainComponent: ShopSettingsRegion,
  priority: 110,
  path: "/settings/shop",
  sidebarI18nLabel: "admin.settings.shopSettingsLabel"
});

registerOperatorRoute({
  group: "settings",
  MainComponent: SystemSettingsRegion,
  path: "/settings/system",
  priority: 300,
  sidebarI18nLabel: "shopSettings.systemInfo.title"
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
  region: "EmailSettings",
  name: "StorefrontUrls",
  component: StorefrontUrls,
  priority: 2
});

// System settings blocks
registerBlock({
  region: "SystemSettings",
  name: "SystemSettingsGeneral",
  component: SystemInformation,
  priority: 1
});
