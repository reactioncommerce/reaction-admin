import gql from "graphql-tag";

export default gql`
  query accounts(
    $groupIds: [ID],
    $first: ConnectionLimitInt,
    $last:  ConnectionLimitInt,
    $before: ConnectionCursor,
    $after: ConnectionCursor,
    $offset: Int,
    $sortBy: AccountSortByField,
    $sortOrder: SortOrder
  ) {
    accounts(
      groupIds: $groupIds,
      first: $first,
      last: $last,
      before: $before,
      after: $after,
      offset: $offset,
      sortBy: $sortBy,
      sortOrder: $sortOrder
    ) {
      nodes {
        _id
        emailRecords {
          address
          verified
        }
        groups {
          nodes {
            _id
            name
          }
        }
        name
      }
      totalCount
    }
  }
`;
