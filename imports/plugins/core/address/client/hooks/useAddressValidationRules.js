import { useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const getAddressValidationRulesQuery = gql`
  query getAddressValidationRules($shopId: ID!, $first: ConnectionLimitInt, $offset: Int) {
    addressValidationRules(shopId: $shopId, first: $first, offset: $offset) {
      nodes {
        _id
        countryCodes
        serviceName
      }
      totalCount
    }
  }
`;

/**
 * @summary React hook that returns the address validation rules for a shop
 * @param {String} shopId Shop ID
 * @return {Object} An object with `addressValidationRules` property, which may be an empty array.
 *  The `isLoadingAddressValidationRules` property will be `true` until the query is done running.
 */
export default function useAddressValidationRules(shopId) {
  const [getAddressValidationRules, { called, data, loading, refetch }] = useLazyQuery(getAddressValidationRulesQuery, {
    fetchPolicy: "network-only"
  });

  return {
    addressValidationRules: (data && data.addressValidationRules && data.addressValidationRules.nodes) || [],
    fetchAddressValidationRules({ first = 20, offset = 0 }) {
      getAddressValidationRules({
        variables: {
          first,
          offset,
          shopId
        }
      });
    },
    isLoadingAddressValidationRules: loading || !called,
    refetchAddressValidationRules: refetch,
    totalAddressValidationRulesCount: (data && data.addressValidationRules && data.addressValidationRules.totalCount) || 0
  };
}
