import React from "react";
import { registerComponent } from "@reactioncommerce/reaction-components";
import { useMutation } from "@apollo/react-hooks";
import { useLocation } from "react-router-dom";
import gql from "graphql-tag";
import Logger from "/client/modules/logger";
import CreateShopForm from "../components/CreateShopForm.js";

const createShopMutation = gql`
  mutation createShop($input: CreateShopInput!) {
    createShop(input: $input) {
      shop {
        _id
      }
    }
  }
`;

/**
 * CreateShopForm
 * @returns {Node} React component
 */
export default function CreateShopFormContainer() {
  const [createShop] = useMutation(createShopMutation, { ignoreResults: true });
  const { search } = useLocation();

  return (
    <CreateShopForm
      onSubmit={async (input) => {
        await createShop({
          variables: {
            input: {
              ...input,
              type: search.includes("primary") ? "primary" : "merchant"
            }
          },
          onError(error) {
            Logger.error(error);
            Alerts.toast("Unable to create shop", "error", { autoHide: 10000 });
          }
        });
      }}
    />
  );
}

registerComponent("CreateShopForm", CreateShopFormContainer);
