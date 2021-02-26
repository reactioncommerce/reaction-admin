import gql from "graphql-tag";

export default gql`
  query emailTemplates(
    $shopId: ID!,
    $first: ConnectionLimitInt,
    $last:  ConnectionLimitInt,
    $before: ConnectionCursor,
    $after: ConnectionCursor,
    $offset: Int
  ) {
    emailTemplates(
      shopId: $shopId,
      first: $first,
      last: $last,
      before: $before,
      after: $after,
      offset: $offset
    ) {
      nodes {
        _id
        title
        subject
        shopId
        language
        template
      }
      totalCount
    }
  }
`;
