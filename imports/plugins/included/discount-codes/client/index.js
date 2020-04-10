import { registerBlock } from "/imports/plugins/core/components/lib";
import "./collections/codes";
import "./templates";
import DiscountCodesTable from "./components/DiscountCodesTable";

registerBlock({
  region: "Discounts",
  name: "DiscountCodes",
  component: DiscountCodesTable,
  priority: 1
});
