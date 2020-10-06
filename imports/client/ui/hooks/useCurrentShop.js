import { useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import useCurrentShopId from "./useCurrentShopId.js";

const getShopQuery = gql`
  query getShop($id: ID!) {
    shop(id: $id) {
      _id
      brandAssets {
        navbarBrandImageId
      }
      defaultParcelSize {
        height
        length
        weight
        width
      }
      language
      name
      shopLogoUrls {
        primaryShopLogoUrl
      }
      shopType
      storefrontUrls {
        storefrontHomeUrl
        storefrontLoginUrl
        storefrontOrderUrl
        storefrontOrdersUrl
        storefrontAccountProfileUrl
      }
    }
  }
`;

/**
 * React Hook that gets the globally current shop
 * @return {Object} Object with `shop` and `shopId` props
 */
export default function useCurrentShop() {
  const [shopId] = useCurrentShopId();

  const [getShop, { called, data, loading, refetch }] = useLazyQuery(getShopQuery, {
    fetchPolicy: "network-only"
  });

  // Wait until we're sure we have a shop ID to call the query
  if ((shopId && !called) || (shopId && !loading && data?.shop?._id !== shopId)) {
    getShop({
      variables: { id: shopId }
    });
  }

  return {
    isLoadingShop: loading,
    refetchShop: refetch,
    shop: data && data.shop,
    shopId
  };
}
