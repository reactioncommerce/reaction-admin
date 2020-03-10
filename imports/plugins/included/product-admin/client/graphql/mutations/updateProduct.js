import gql from "graphql-tag";
import Product from "../fragments/productWithVariants";

export default gql`
  mutation updateProduct($input: UpdateProductInput!){
    updateProduct(input: $input){
      product {
        ...Product
      }
    }
  }
  ${Product}
`;
