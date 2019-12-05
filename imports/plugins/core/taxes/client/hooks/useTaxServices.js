import { useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const getTaxServicesQuery = gql`
  query getTaxServices($shopId: ID!) {
    taxServices(shopId: $shopId) {
      displayName
      name
    }
  }
`;


/**
 * @summary React hook that returns the tax services for a shop
 * @param {String} shopId Shop ID
 * @return {Object} An object with `taxServices` property, which may be an empty array.
 *  The `isLoadingTaxServices` property will be `true` until the query is done running.
 */
export default function useTaxServices(shopId) {
  const [getTaxServices, { called, loading, data }] = useLazyQuery(getTaxServicesQuery);

  // Wait until we're sure we have a shop ID to call the query
  if (shopId && !called) {
    getTaxServices({
      variables: { shopId }
    });
  }

  return {
    isLoadingTaxServices: loading || !called,
    taxServices: (data && data.taxServices) || []
  };
}
