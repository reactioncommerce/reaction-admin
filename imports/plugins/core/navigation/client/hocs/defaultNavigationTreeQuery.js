import gql from "graphql-tag";
import { navigationTreeWith10LevelsFragment } from "./fragments";

export default gql`
  query defaultNavigationTreeQuery($id: ID!, $language: String!, $shopId: ID!) {
    navigationTreeById(id: $id, language: $language, shopId: $shopId) {
      ...NavigationTreeWith10Levels
    }
  }

  ${navigationTreeWith10LevelsFragment}
`;
