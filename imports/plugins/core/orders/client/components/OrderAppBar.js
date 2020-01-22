import React from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import { i18next, Reaction } from "/client/api";
import Logger from "/client/modules/logger";
import ConfirmButton from "/imports/client/ui/components/ConfirmButton";
import PrimaryAppBar from "/imports/client/ui/components/PrimaryAppBar/PrimaryAppBar";
import cancelOrderItemMutation from "../graphql/mutations/cancelOrderItem";

/**
 * @name OrderAppBar
 * @param {Object} props Component props
 * @returns {React.Component} returns a React component
 */
function OrderAppBar(props) {
  const hasPermission = Reaction.hasPermission(["reaction:legacy:orders/update"], Reaction.getUserId(), Reaction.getShopId());
  const { order } = props;
  const canCancelOrder = (order.status !== "coreOrderWorkflow/canceled");

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

  return (
    <PrimaryAppBar title={i18next.t("orderDetails", "Order details")}>
      {cancelOrderButton}
    </PrimaryAppBar>
  );
}

OrderAppBar.propTypes = {
  classes: PropTypes.object,
  order: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string
  })
};

export default OrderAppBar;
