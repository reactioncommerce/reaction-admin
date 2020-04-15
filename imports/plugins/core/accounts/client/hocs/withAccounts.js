import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const getAccounts = gql`
  query accounts(
    $groupIds: [ID],
    $first: ConnectionLimitInt,
    $last:  ConnectionLimitInt,
    $before: ConnectionCursor,
    $after: ConnectionCursor,
    $offset: Int,
    $sortBy: AccountSortByField,
    $sortOrder: SortOrder
  ) {
    accounts(
      groupIds: $groupIds,
      first: $first,
      last: $last,
      before: $before,
      after: $after,
      offset: $offset,
      sortBy: $sortBy,
      sortOrder: $sortOrder
    ) {
      nodes {
        _id
        addressBook {
          nodes {
            address1
          }
        }
        createdAt
        currency {
          code
        }
        emailRecords {
          address
          verified
        }
        groups {
          nodes {
            _id
            description
            name
            permissions
          }
        }
        metafields {
          key
          scope
          namespace
          description
          value
          valueType
        }
        name
        note
        preferences
        updatedAt
      }
    }
  }
`;

export default (Component) => (
  class AccountsQuery extends React.Component {
    static propTypes = {
      groups: PropTypes.array
    };

    render() {
      const { groups } = this.props;

      const groupIds = groups && groups.map((group) => group._id);

      return (
        <Query query={getAccounts} variables={{ groupIds }}>
          {({ loading, data }) => {
            const props = {
              ...this.props,
              isLoadingAccounts: loading
            };

            if (!loading && data) {
              props.accounts = data.accounts.nodes;
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
