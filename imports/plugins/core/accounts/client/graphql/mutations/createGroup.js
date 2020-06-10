import gql from "graphql-tag";

export default gql`
  mutation createAccountGroup($input: CreateAccountGroupInput!) {
    createAccountGroup(input: $input) {
      group {
        name
      }
    }
  }
`;
