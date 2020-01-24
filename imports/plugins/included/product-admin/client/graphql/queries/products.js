import gql from "graphql-tag";

export default gql`
  query products($shopIds: [ID]!, $query: String, $first: ConnectionLimitInt, $offset: Int) {
    products(shopIds: $shopIds, query: $query, first: $first, offset: $offset) {
      nodes {
          _id
        title
        currentProductHash
        isVisible
        media {
          URLs {
            thumbnail
          }
        }
        price {
          range
        }
        publishedProductHash
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
