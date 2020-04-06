import gql from "graphql-tag";

export default gql`
  query discountCodesQuery($shopId: ID!) {
    discountCodes(shopId: $shopId) {
      nodes {
        code
        discount
        conditions {
          accountLimit
          redemptionLimit
        }
        calculation {
          method
        }
      }
      totalCount
    }
  }
`;
