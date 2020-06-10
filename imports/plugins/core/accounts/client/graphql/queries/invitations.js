import gql from "graphql-tag";

export default gql`
  query invitations(
    $shopIds: [ID],
    $first: ConnectionLimitInt,
    $last:  ConnectionLimitInt,
    $offset: Int,
    $sortBy: AccountSortByField,
    $sortOrder: SortOrder
  ) {
    invitations(
      shopIds: $shopIds,
      first: $first,
      last: $last,
      offset: $offset,
      sortBy: $sortBy,
      sortOrder: $sortOrder
    ) {
      nodes {
        _id
        groups {
          name
        }
        email
        shop {
          name
        }
        invitedBy {
          emailRecords {
            address
          }
        }
      }
      totalCount
    }
  }
`;
