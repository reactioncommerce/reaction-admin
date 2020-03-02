import i18next from "i18next";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { useSnackbar } from "notistack";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import shopQuery from "../graphql/queries/shop";
import updateShopMutation from "../graphql/mutations/updateShop";

/**
 * @method useShopSettings
 * @summary  useShopSettings hook
 * @param {Object} args input arguments
 * @param {String} args.shopId Id of the shop to update settings on
 * @param {Object} args.fields Shop setting fields to update
 * @returns {Object} The updated shop object
 */
function useShopSettings(args = {}) {
  const {
    shopId: providedShopId
  } = args;
  const [currentShopId] = useCurrentShopId();
  const [updateShop] = useMutation(updateShopMutation);
  const shopId = providedShopId || currentShopId;
  const { enqueueSnackbar } = useSnackbar();
  const [fetchShop, { called, loading, data: shopQueryResult, refetch: refetchShopQuery }] = useLazyQuery(shopQuery);

  if (shopId && !called) {
    fetchShop({
      variables: {
        id: shopId
      }
    });
  }

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
    loading,
    onUpdateShop,
    refetchShopQuery,
    shop: (shopQueryResult && shopQueryResult.shop) || {},
    shopId
  };
}

export default useShopSettings;
