import gql from "graphql-tag";

export default gql`
  mutation deleteDiscountCode($input: DeleteDiscountCodeInput!) {
    deleteDiscountCode(input: $input) {
      discountCode {
        _id
      }
    }
  }
`;

