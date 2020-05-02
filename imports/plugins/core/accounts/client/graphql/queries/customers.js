import gql from "graphql-tag";

export default gql`
  query customers(
    $first: ConnectionLimitInt,
    $last:  ConnectionLimitInt,
    $before: ConnectionCursor,
    $after: ConnectionCursor,
    $offset: Int,
    $sortBy: AccountSortByField,
    $sortOrder: SortOrder
  ) {
    customers(
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
        name
      }
      totalCount
    }
  }
`;
