import { registerBlock } from "/imports/plugins/core/components/lib";
import ShippingRatesSettings from "../containers/ShippingRatesSettings";

registerBlock({
  region: "ShippingSettings",
  name: "ShippingRatesSettings",
  component: ShippingRatesSettings,
  priority: 1
});
