import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const getAddressValidationServicesQuery = gql`
  query getAddressValidationServices {
    addressValidationServices {
      displayName
      name
      supportedCountryCodes
    }
  }
`;

/**
 * @summary React hook that returns the registered address validation services
 * @return {Object} An object with `addressValidationServices` property, which may be an empty array.
 *  The `isLoadingAddressValidationServices` property will be `true` until the query is done running.
 */
export default function useAddressValidationServices() {
  const { data, loading } = useQuery(getAddressValidationServicesQuery);

  return {
    addressValidationServices: (data && data.addressValidationServices) || [],
    isLoadingAddressValidationServices: loading
  };
}
