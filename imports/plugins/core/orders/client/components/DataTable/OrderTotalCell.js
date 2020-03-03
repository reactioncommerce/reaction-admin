import React from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";

/**
 * @name OrderTotalCell
 * @param {Object} row A react-table row object
 * @return {React.Component} A React component to render an order's total
 */
function OrderTotalCell({ row }) {
  return (
    <Box textAlign="right">
      {row.values["summary.total.displayAmount"]}
    </Box>
  );
}

OrderTotalCell.propTypes = {
  row: PropTypes.object.isRequired
};

export default OrderTotalCell;
