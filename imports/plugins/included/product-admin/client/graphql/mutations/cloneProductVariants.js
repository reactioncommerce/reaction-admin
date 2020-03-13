import gql from "graphql-tag";

export default gql`
  mutation cloneProductVariants($input: CloneProductVariantsInput!) {
    cloneProductVariants(input: $input) {
      variants {
        _id
      }
    }
  }
`;
