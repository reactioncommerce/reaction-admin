import gql from "graphql-tag";
import discountCodeFragment from "../Fragments/DiscountCodeCommon";

export default gql`
  query discountCodesQuery($shopId: ID!) {
    discountCodes(shopId: $shopId) {
      nodes {
        ...DiscountCodeCommon
      }
      totalCount
    }
  }
  ${discountCodeFragment}
`;
