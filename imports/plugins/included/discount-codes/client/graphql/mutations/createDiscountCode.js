import gql from "graphql-tag";

export default gql`
  mutation createDiscountCode($input: CreateDiscountCodeInput!) {
    createDiscountCode(input: $input) {
      discountCode {
        _id
      }
    }
  }
`;

