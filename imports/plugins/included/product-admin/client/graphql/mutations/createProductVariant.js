import gql from "graphql-tag";
import ProductVariant from "../fragments/productVariant";

export default gql`
  mutation createProductVariant($input: CreateProductVariantInput!) {
    createProductVariant(input: $input) {
      variant {
        ...ProductVariant
      }
    }
  }
  ${ProductVariant}
`;
