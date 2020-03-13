import gql from "graphql-tag";

export default gql`
  mutation updateProductVariantPrices($input: UpdateProductVariantPricesInput!) {
    updateProductVariantPrices(input: $input) {
      variant {
        _id
        price
        compareAtPrice
      }
    }
  }
`;
