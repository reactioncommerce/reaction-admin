import gql from "graphql-tag";

export default gql`
  mutation ($productIds: [ID]!) {
    publishProductsToCatalog(productIds: $productIds) {
      product {
        productId
      }
    }
  }
`;
