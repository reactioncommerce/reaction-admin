import React from "react";
import { Blocks } from "@reactioncommerce/reaction-components";

/**
 * @summary Renders discounts page
 * @param {Object} props Component props
 * @return {React.Node} React node
 */
export default function DiscountsPage(props) {
  return (
    <Blocks region="Discounts" blockProps={props} />
  );
}
