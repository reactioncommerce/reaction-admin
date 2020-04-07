import gql from "graphql-tag";

export default gql`
 fragment DiscountCodeCommon on DiscountCode {
  code
  discount
  calculation {
    method
  }
  conditions {
    enabled
    accountLimit
    redemptionLimit
  }
  description
  discountMethod
 }`;

