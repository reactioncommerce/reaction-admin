import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const roles = gql`
  query ($shopId: ID!) {
    roles(shopId: $shopId){
      nodes {
        name
      }
    }
  }
`;

export default (Component) => (
  class RolesQuery extends React.Component {
    static propTypes = {
      shopId: PropTypes.array
    };

    render() {
      const { shopId } = this.props;

      if (!shopId) {
        return (
          <Component {...this.props} />
        );
      }

      return (
        <Query query={roles} variables={{ shopId }}>
          {({ loading, data }) => {
            const props = {
              ...this.props,
              isLoadingRoles: loading
            };

            if (!loading && data) {
              props.roles = data.roles.nodes;
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
