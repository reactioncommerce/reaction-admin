import gql from "graphql-tag";

export default gql`
  query getGroups($shopId: ID!) {
    groups(shopId: $shopId) {
      nodes {
        _id
        createdAt
        createdBy {
          _id
        }
        description
        name
        permissions
        slug
        updatedAt
      }
    }
  }
`;
