import { registerBlock } from "/imports/plugins/core/components/lib";
import VariantInventoryForm from "./VariantInventoryForm";

registerBlock({
  region: "VariantDetailMain",
  name: "VariantInventoryForm",
  component: VariantInventoryForm,
  priority: 30
});
