import { registerBlock } from "/imports/plugins/core/components/lib";
import CustomTaxRatesSettings from "./components/CustomTaxRatesSettings.js";

registerBlock({
  region: "TaxSettings",
  name: "CustomTaxRatesSettings",
  component: CustomTaxRatesSettings,
  priority: 1
});
