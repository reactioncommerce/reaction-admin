import gql from "graphql-tag";

export default gql`
  mutation ($input: UpdateGroupsForAccountsInput!) {
    updateGroupsForAccounts(input: $input) {
      accounts {
        _id
      }
    }
  }
`;
