import gql from "graphql-tag";

export default gql`
  query products($shopIds: [ID]!, $query: String, $first: ConnectionLimitInt, $offset: Int) {
    products(shopIds: $shopIds, query: $query, first: $first, offset: $offset) {
      nodes {
          _id
        title
        price {
          range
        }
        publishedProductHash
        currentProductHash
        isVisible
        variants {
          _id
        }
      }
      pageInfo {
        hasNextPage
      }
      totalCount
    }
}
`;
