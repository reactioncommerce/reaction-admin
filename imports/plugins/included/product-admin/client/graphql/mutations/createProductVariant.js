import gql from "graphql-tag";
import Product from "../fragments/productWithVariants";

export default gql`
  mutation createProductVariant($input: CreateProductVariantInput!) {
    createProductVariant(input: $input) {
      product {
        ...Product
      }
    }
  }
  ${Product}
`;
