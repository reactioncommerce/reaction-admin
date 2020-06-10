import gql from "graphql-tag";

export default gql`
  query ($shopId: ID!) {
    roles(shopId: $shopId) {
      nodes {
        name
      }
    }
  }
`;
