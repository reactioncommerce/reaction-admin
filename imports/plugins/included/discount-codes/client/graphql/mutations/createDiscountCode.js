import gql from "graphql-tag";

export default gql`
  mutation createDiscountCodeMutation($input: CreateDiscountCodeInput!) {
    createDiscountCode(input: $input) {
      nodes {
        _id
      }
    }
  }
`;

