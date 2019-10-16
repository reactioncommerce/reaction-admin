import React from "react";
import { registerComponent } from "@reactioncommerce/reaction-components";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Logger from "/client/modules/logger";
import CreateFirstShopForm from "../components/CreateFirstShopForm.js";

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
 * CreateFirstShopForm
 * @returns {Node} React component
 */
function CreateFirstShopFormContainer() {
  const [createShop] = useMutation(createShopMutation, { ignoreResults: true });

  return (
    <CreateFirstShopForm
      onSubmit={async (input) => {
        await createShop({
          variables: { input },
          onError(error) {
            Logger.error(error);
            Alerts.toast("Unable to create shop", "error", { autoHide: 10000 });
          }
        });
      }}
    />
  );
}

registerComponent("CreateFirstShopForm", CreateFirstShopFormContainer);
