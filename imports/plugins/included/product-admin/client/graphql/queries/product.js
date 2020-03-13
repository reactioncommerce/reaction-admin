import gql from "graphql-tag";
import Product from "../fragments/productWithVariants";

export default gql`
  query product($productId: ID!, $shopId: ID!) {
    product(productId: $productId, shopId: $shopId) {
      ...Product
    }
  }
  ${Product}
`;
