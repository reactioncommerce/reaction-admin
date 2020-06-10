import { useLazyQuery } from "@apollo/react-hooks";
import groupsQuery from "../graphql/queries/groups";

/**
 * @summary Hook to get groups
 * @name useGroups
 * @param {String} shopId - the shop ID to get groups for
 * @return {Object} Permissions
 */
export default function useGroups(shopId) {
  const [getGroups, { called, data, loading, refetch }] = useLazyQuery(groupsQuery);

  // Wait until we're sure we have a shop ID to call the query
  if (shopId && !called) {
    getGroups({
      variables: { shopId }
    });
  }

  return {
    isLoadingGroups: loading || !called,
    refetchGroups: refetch,
    groups: (data && data.groups.nodes) || []
  };
}
