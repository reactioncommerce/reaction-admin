import React from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";

/**
 * @name OrderTotalCell
 * @param {Object} row A react-table row object
 * @return {React.Component} A React component to render an order's total
 */
function OrderTotalCell({ row }) {
  // Sum up all the payments on an orders. Since the API returns
  // the payments already formatted, just use the currency symbol provided.
  const currencySymbol = row.original.payments[0].amount.displayAmount.charAt(0);
  const reducer = (accumulator, value) => accumulator + Number.parseFloat(value.amount.displayAmount.slice(1));
  const total = row.original.payments.reduce(reducer, 0);

  return (
    <Box textAlign="right">
      {currencySymbol}{total}
    </Box>
  );
}

OrderTotalCell.propTypes = {
  row: PropTypes.object.isRequired
};

export default OrderTotalCell;
