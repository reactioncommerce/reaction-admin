import gql from "graphql-tag";
import shopCommonFragment from "../fragments/shopCommon";

export default gql`
  query shopQuery($id: ID!) {
    shop(id: $id) {
      ...ShopCommon
    }
  }
  ${shopCommonFragment}
`;
