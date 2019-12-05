import { useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const getTaxCodesQuery = gql`
  query getTaxCodes($shopId: ID!) {
    taxCodes(shopId: $shopId) {
      code
      label
    }
  }
`;

/**
 * @summary React hook that returns all defined tax codes for a shop
 * @param {String} shopId Shop ID
 * @return {Object} An object with `taxCodes` property, which may be an empty array.
 *  The `isLoadingTaxCodes` property will be `true` until the query is done running.
 */
export default function useTaxCodes(shopId) {
  const [getTaxCodes, { called, data, loading, refetch }] = useLazyQuery(getTaxCodesQuery);

  // Wait until we're sure we have a shop ID to call the query
  if (shopId && !called) {
    getTaxCodes({
      variables: { shopId }
    });
  }

  return {
    isLoadingTaxCodes: loading || !called,
    refetchTaxCodes: refetch,
    taxCodes: (data && data.taxCodes) || []
  };
}
