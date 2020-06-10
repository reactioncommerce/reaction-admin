import gql from "graphql-tag";

export default gql`
  mutation inviteShopMember($input: InviteShopMemberInput!) {
    inviteShopMember(input: $input) {
      clientMutationId
    }
  }
`;
