import gql from "graphql-tag";

export default gql`
  mutation createProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      product {
        _id
      }
    }
  }
`;
