import { registerBlock } from "@reactioncommerce/reaction-components";
import SitemapSettings from "./components/SitemapSettings";

registerBlock({
  region: "ShopSettings",
  name: "SitemapSettings",
  component: SitemapSettings,
  priority: 9
});
