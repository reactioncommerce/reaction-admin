import gql from "graphql-tag";
import shopCommon from "../fragments/shopCommon";

export default gql`
  mutation updateShop($input: UpdateShopInput!) {
    updateShop(input: $input) {
      shop {
        ...ShopCommon
      }
    }
  }
  ${shopCommon}
`;
