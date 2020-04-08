import { registerBlock } from "/imports/plugins/core/components/lib";
import "./collections/codes";
import "./templates";
import DiscountCodes from "./DiscountCodes.js";
import DiscountCodesTable from "./components/DiscountCodesTable";

registerBlock({
  region: "Discounts",
  name: "DiscountCodes",
  component: DiscountCodesTable,
  priority: 1
});

registerBlock({
  region: "Discounts",
  name: "DiscountCodesOLD",
  component: DiscountCodes,
  priority: 2
});
