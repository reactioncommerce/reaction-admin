import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import defaultNavigationTreeQuery from "./defaultNavigationTreeQuery";

export default (Component) => (
  class WithDefaultNavigationTree extends React.Component {
    static propTypes = {
      defaultNavigationTreeId: PropTypes.string.isRequired,
      onSetNavigationTree: PropTypes.func,
      shopId: PropTypes.string
    }

    static defaultProps = {
      defaultNavigationTreeId: ""
    }

    handleSetNavigationTree = (data) => {
      if (data && data.navigationTreeById && data.navigationTreeById.draftItems) {
        this.props.onSetNavigationTree(data.navigationTreeById.draftItems);
      }
    }

    render() {
      const { defaultNavigationTreeId, shopId } = this.props;

      if (!defaultNavigationTreeId) {
        return <Component {...this.props} />;
      }

      const variables = {
        id: defaultNavigationTreeId,
        language: "en",
        shopId
      };

      return (
        <Query
          query={defaultNavigationTreeQuery}
          variables={variables}
          onCompleted={this.handleSetNavigationTree}
          notifyOnNetworkStatusChange={true}
        >
          {({ data, loading, refetch }) => {
            let navigationTreeName;
            if (!loading) {
              if (data && data.navigationTreeById && data.navigationTreeById.name) {
                navigationTreeName = data.navigationTreeById.name;
              }
            }

            return (
              <Component
                {...this.props}
                navigationTreeName={navigationTreeName}
                refetchNavigationTree={refetch}
              />
            );
          }}
        </Query>
      );
    }
  }
);
