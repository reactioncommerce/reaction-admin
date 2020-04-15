import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const getGroups = gql`
  query getGroups($shopId: ID!) {
    groups(shopId: $shopId) {
      nodes {
        _id
        createdAt
        createdBy {
          _id
        }
        description
        name
        permissions
        slug
        updatedAt
      }
    }
  }
`;

export default (Component) => (
  class GroupsQuery extends React.Component {
    static propTypes = {
      shopId: PropTypes.string
    };

    render() {
      const { shopId } = this.props;

      if (!shopId) {
        return (
          <Component {...this.props} />
        );
      }

      return (
        <Query query={getGroups} variables={{ shopId }}>
          {({ loading, data }) => {
            const props = {
              ...this.props,
              isLoadingGroups: loading
            };

            if (!loading && data) {
              props.groups = data.groups.nodes;
              props.adminGroups = props.groups.filter((group) => group.slug !== "customer" && group.slug !== "guest");
            }

            return (
              <Component {...props} />
            );
          }}
        </Query>
      );
    }
  }
);
