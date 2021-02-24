import { useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const getEmailJobsQuery = gql`
  query getEmailJobs($shopIds: [ID]!, $first: ConnectionLimitInt, $offset: Int) {
    emailJobs(shopIds: $shopIds, first: $first, offset: $offset) {
      nodes {
        _id
        updated
        status
        data {
          to
          subject
        }
      }
      totalCount
    }
  }
`;

/**
 * @summary React hook that returns the email jobs for a set of shops
 * @param {String[]} shopIds Shop IDs
 * @param {Number} first Number of results to fetch initially and each time `fetchMoreEmailJobs` is called
 * @return {Object} An object with `emailJobs` property, which may be an empty array.
 *  The `isLoadingEmailJobs` property will be `true` until the query is done running.
 */
export default function useEmailJobs(shopIds) {
  const [getEmailJobs, { called, data, loading, refetch }] = useLazyQuery(getEmailJobsQuery, {
    fetchPolicy: "network-only"
  });

  return {
    fetchEmailJobs({ first = 20, offset = 0 }) {
      getEmailJobs({
        variables: {
          first,
          offset,
          shopIds
        }
      });
    },
    isLoadingEmailJobs: loading || !called,
    refetchEmailJobs: refetch,
    emailJobs: (data && data.emailJobs && data.emailJobs.nodes) || [],
    totalEmailJobsCount: (data && data.emailJobs && data.emailJobs.totalCount) || 0
  };
}
