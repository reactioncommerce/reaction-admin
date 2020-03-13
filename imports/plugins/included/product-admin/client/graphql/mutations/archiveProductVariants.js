import gql from "graphql-tag";

export default gql`
  mutation archiveProductVariants($input: ArchiveProductVariantsInput!) {
    archiveProductVariants(input: $input) {
      variants {
        _id
      }
    }
  }
`;
