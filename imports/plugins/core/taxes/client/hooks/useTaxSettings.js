import { useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import _ from "lodash";

export const getTaxSettingsQuery = gql`
  query shopTaxSettingsQuery($shopId: ID!) {
    shopSettings(shopId: $shopId) {
      defaultTaxCode
      fallbackTaxServiceName
      primaryTaxServiceName
    }
  }
`;

/**
 * @summary React hook that returns the tax settings for a shop
 * @param {String} shopId Shop ID
 * @return {Object} An object with `defaultTaxCode`, `fallbackTaxServiceName`,
 *  and `primaryTaxServiceName` properties, which may be `null`. The `isLoading`
 *  property will be `true` until the query is done running.
 */
export default function useTaxSettings(shopId) {
  const [getTaxSettings, { called, loading, data }] = useLazyQuery(getTaxSettingsQuery);

  // Wait until we're sure we have a shop ID to call the query
  if (shopId && !called) {
    getTaxSettings({
      variables: { shopId }
    });
  }

  return {
    defaultTaxCode: _.get(data, "shopSettings.defaultTaxCode", null),
    fallbackTaxServiceName: _.get(data, "shopSettings.fallbackTaxServiceName", null),
    isLoadingTaxSettings: loading || !called,
    primaryTaxServiceName: _.get(data, "shopSettings.primaryTaxServiceName", null)
  };
}
