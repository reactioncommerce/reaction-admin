import gql from "graphql-tag";

export default gql`
    mutation updateTemplate($input: UpdateTemplateInput!) {
      updateTemplate(input: $input) {
        template {
          _id
        }
      }
    }
`;
