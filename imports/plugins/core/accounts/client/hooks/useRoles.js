import { useLazyQuery } from "@apollo/react-hooks";
import rolesQuery from "../graphql/queries/roles";

/**
 * @summary Hook to get groups
 * @name useRoles
 * @param {String} shopId - the shop ID to get roles for
 * @return {Object} Permissions
 */
export default function useRoles(shopId) {
  const [getRoles, { called, data, loading, refetch }] = useLazyQuery(rolesQuery);

  // Wait until we're sure we have a shop ID to call the query
  if (shopId && !called) {
    getRoles({
      variables: { shopId }
    });
  }

  return {
    isLoadingRoles: loading || !called,
    refetchRoles: refetch,
    roles: (data && data.roles.nodes) || []
  };
}
