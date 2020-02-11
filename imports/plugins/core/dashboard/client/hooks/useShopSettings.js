import i18next from "i18next";
import gql from "graphql-tag";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import { useSnackbar } from "notistack";

const SHOP_QUERY = gql`
  query shopSettings($id: ID!) {
    shop(id: $id) {
      _id
      addressBook {
        company
        fullName
        address1
        address2
        city
        region
        postal
        country
        phone
        isCommercial
      }
      description
      emails {
        address
      }
      keywords
      name
      slug
    }
  }
`;

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
  const {
    shopId: providedShopId
  } = args;
  const [currentShopId] = useCurrentShopId();
  const [updateShop] = useMutation(UPDATE_SHOP);
  const shopId = providedShopId || currentShopId;
  const { enqueueSnackbar } = useSnackbar();
  const [fetchShop, { called, data: shopQueryResult, refetch }] = useLazyQuery(SHOP_QUERY);

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
      enqueueSnackbar(i18next.t("admin.settings.saveSuccess"));
    } catch (error) {
      enqueueSnackbar(i18next.t("admin.settings.saveFailed"));
    }
  };

  return {
    onUpdateShop,
    refetch,
    shop: (shopQueryResult && shopQueryResult.shop) || {},
    shopId
  };
}

export default useShopSettings;
