import { registerBlock } from "@reactioncommerce/reaction-components";
import CustomTaxRatesSettings from "./components/CustomTaxRatesSettings.js";

registerBlock({
  region: "TaxSettings",
  name: "CustomTaxRatesSettings",
  component: CustomTaxRatesSettings,
  priority: 1
});
