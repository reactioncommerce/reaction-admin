import gql from "graphql-tag";
import ProductVariant from "../fragments/productVariant";

export default gql`
  mutation updateProductVariant($input: UpdateProductVariantInput!) {
    updateProductVariant(input: $input) {
      variant {
        ...ProductVariant
      }
    }
  }
  ${ProductVariant}
`;
