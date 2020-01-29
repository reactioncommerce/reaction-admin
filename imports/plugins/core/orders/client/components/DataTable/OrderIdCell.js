import React from "react";
import PropTypes from "prop-types";
import { i18next } from "/client/api";
import Chip from "@reactioncommerce/catalyst/Chip";
import { Box } from "@material-ui/core";

/**
 * @name OrderIdCell
 * @param {Object} row A react-table row object
 * @param {Object} history Router history API
 * @return {React.Component} A date component
 */
function OrderIdCell({ cell, row }) {
  let chipColor;
  switch (row.original.status) {
    case "new":
      chipColor = "success";
      break;
    case "coreOrderWorkflow/processing":
      chipColor = "info";
      break;
    case "coreOrderWorkflow/canceled":
      chipColor = "danger";
      break;
    default:
      chipColor = "info";
      break;
  }

  return (
    <Box style={{ whiteSpace: "nowrap" }}>
      <Box
        component="span"
        paddingRight={2}
      >
        {cell.value}
      </Box>
      {status !== "completed" ?
        <Chip
          color={chipColor}
          variant="default"
          label={i18next.t(`admin.table.orderStatus.${row.values.status}`)}
        />
        :
        <span>{row.values.status}</span>
      }
    </Box>
  );
}

OrderIdCell.propTypes = {
  cell: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired
};

export default OrderIdCell;
