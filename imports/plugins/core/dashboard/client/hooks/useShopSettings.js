import { useState, useCallback, useMemo } from "react";
import i18next from "i18next";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import encodeOpaqueId from "@reactioncommerce/api-utils/encodeOpaqueId.js";
import { useSnackbar } from "notistack";

const UPDATE_SHOP = gql`
  mutation updateShop($input: UpdateShopInput!) {
    updateShop(input: $input) {
      shop {
        name
      }
    }
  }
`;

/**
 * @method useShopSettings
 * @summary  useShopSettings hook
 * @param {Object} args input arguments
 * @param {String} args.shopId Id of the shop to update settings on
 * @param {Object} args.fields Shop setting fields to update
 * @returns {Object} The updated shop object
 */
function useShopSettings(args = {}) {
  const { enqueueSnackbar } = useSnackbar();
  const {
    shopId: providedShopId
  } = args;
  const [updateShop] = useMutation(UPDATE_SHOP);
  const [currentShopId] = useCurrentShopId();
  const shopId = providedShopId || currentShopId;

  /**
   * @method onUpdateShop
   * @param {Object} fields Fields in `UpdateShopInput` that can be updated.
   * @param {String} .shopId Shop ID of the shop to update settings for. Leave blank for current shop.
   * @returns {undefined} no return value
   */
  const onUpdateShop = async ({
    shopId: shopIdLocal = shopId,
    ...fields
  }) => {
    // certain fields need a transformation
    if (fields.emails) {
      fields.emails = [{ address: fields.emails }];
    }

    try {
      await updateShop({
        variables: {
          input: {
            ...fields,
            shopId: shopIdLocal
          }
        }
      });

      enqueueSnackbar(i18next.t("admin.settings.saveSuccess"), { variant: "success" });
    } catch (error) {
      enqueueSnackbar(i18next.t("admin.settings.saveFailed"), { variant: "error" });
    }
  };

  return {
    onUpdateShop,
    shopId
  };
}

export default useShopSettings;
