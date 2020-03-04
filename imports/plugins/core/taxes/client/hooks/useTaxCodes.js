import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const getTaxCodes = gql`
  query getTaxCodes($shopId: ID!) {
    taxCodes(shopId: $shopId) {
      code
      label
    }
  }
`;

/**
 * Get tax codes
 * @param {Object} args An object containing arguments
 * @param {String} args.shopId  Shop Id
 * @returns {Object} An object containing tax codes
 */
export default function useTaxCodes({ shopId }) {
  const { data, isLoading, refetch } = useQuery(getTaxCodes, {
    variables: {
      shopId
    },
    skip: !shopId
  });

  return {
    isLoading,
    refetch,
    taxCodes: data
  };
}
