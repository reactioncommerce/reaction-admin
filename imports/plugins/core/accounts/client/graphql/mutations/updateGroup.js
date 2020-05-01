import gql from "graphql-tag";

export default gql`
  mutation updateAccountGroup($input: UpdateAccountGroupInput!) {
    updateAccountGroup(input: $input) {
      group {
        _id
      }
    }
  }
`;
