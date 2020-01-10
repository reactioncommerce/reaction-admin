import { registerBlock } from "/imports/plugins/core/components/lib";
import "./collections/codes";
import "./templates";
import DiscountCodes from "./DiscountCodes.js";

registerBlock({
  region: "Discounts",
  name: "DiscountCodes",
  component: DiscountCodes,
  priority: 1
});
