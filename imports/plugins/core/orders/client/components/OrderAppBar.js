import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import { i18next, Reaction } from "/client/api";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import Logger from "/client/modules/logger";
import ConfirmButton from "/imports/client/ui/components/ConfirmButton";
import PrimaryAppBar from "/imports/client/ui/components/PrimaryAppBar/PrimaryAppBar";
import ArrowLeft from "mdi-material-ui/ArrowLeft";
import cancelOrderItemMutation from "../graphql/mutations/cancelOrderItem";

const useStyles = makeStyles({
  goBackTitleLink: {
    display: "flex",
    alignItems: "center"
  },
  title: {
    marginLeft: 10
  }
});

/**
 * @name OrderAppBar
 * @param {Object} props Component props
 * @returns {React.Component} returns a React component
 */
function OrderAppBar(props) {
  const history = useHistory();
  const hasPermission = Reaction.hasPermission(["reaction:legacy:orders/update"], Reaction.getUserId(), Reaction.getShopId());
  const { order } = props;
  const canCancelOrder = (order.status !== "coreOrderWorkflow/canceled");
  const classes = useStyles();

  const handleCancelOrder = (mutation) => {
    if (hasPermission && canCancelOrder) {
      const { fulfillmentGroups } = order;

      // We need to loop over every fulfillmentGroup
      // and then loop over every item inside group
      for (const fulfillmentGroup of fulfillmentGroups) {
        for (const item of fulfillmentGroup.items.nodes) {
          mutation({
            variables: {
              cancelQuantity: item.quantity,
              itemId: item._id,
              orderId: order._id,
              reason: "Order cancelled inside Catalyst operator UI"
            }
          }).catch((error) => {
            Logger.error(error);
          });
        }
      }
    }

    return null;
  };

  let cancelOrderButton;
  if (hasPermission && canCancelOrder) {
    cancelOrderButton =
      <Mutation mutation={cancelOrderItemMutation}>
        {(mutationFunc) => (
          <ConfirmButton
            buttonColor="danger"
            buttonText={i18next.t("order.cancelOrderLabel", "Cancel order")}
            buttonVariant="contained"
            cancelActionText={i18next.t("app.close", "Close")}
            confirmActionText={i18next.t("order.cancelOrderLabel", "Cancel order")}
            title={i18next.t("order.cancelOrderLabel", "Cancel order")}
            message={i18next.t("order.cancelOrder", "Do you want to cancel this order?")}
            onConfirm={() => handleCancelOrder(mutationFunc)}
          />
        )}
      </Mutation>
    ;
  }

  const backIconTitle = (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a href="#" className={classes.goBackTitleLink} onClick={(event) => {
      event.preventDefault();
      history.goBack();
    }}
    >
      <ArrowLeft />
      <span className={classes.title}>
        {i18next.t("orderDetails", "Order details")}
      </span>
    </a>
  );

  return (
    <PrimaryAppBar title={backIconTitle}>
      {cancelOrderButton}
    </PrimaryAppBar>
  );
}

OrderAppBar.propTypes = {
  classes: PropTypes.object,
  order: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string,
    fulfillmentGroups: PropTypes.array
  })
};

export default OrderAppBar;
