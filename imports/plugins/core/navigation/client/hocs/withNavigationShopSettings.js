import React from "react";
import { Query } from "react-apollo";
import PropTypes from "prop-types";
import shopSettingsQuery from "./shopSettingsQuery";

export default (Component) => (
  class NavigationShopSettingsQuery extends React.Component {
    static propTypes = {
      shopId: PropTypes.string
    }

    render() {
      const { shopId } = this.props;

      if (!shopId) return null;

      return (
        <Query query={shopSettingsQuery} variables={{ shopId }}>
          {({ loading, data }) => {
            const props = {
              ...this.props,
              isLoadingNavigationShopSettings: loading,
              shopId
            };

            if (!loading && data) {
              props.navigationShopSettings = data.shopSettings;
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
