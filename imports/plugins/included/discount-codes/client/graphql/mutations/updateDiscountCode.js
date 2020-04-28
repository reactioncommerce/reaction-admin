import gql from "graphql-tag";

export default gql`
  mutation updateDiscountCode($input: UpdateDiscountCodeInput!) {
    updateDiscountCode(input: $input) {
      discountCode {
        _id
      }
    }
  }
`;

