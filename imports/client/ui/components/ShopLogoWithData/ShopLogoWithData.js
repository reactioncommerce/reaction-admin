import React from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import withStyles from "@material-ui/core/styles/withStyles";
import { withComponents } from "@reactioncommerce/components-context";
import withPrimaryShopId from "/imports/plugins/core/graphql/lib/hocs/withPrimaryShopId";
import GenericErrorBoundary from "../GenericErrorBoundary";

const defaultLogo = "/resources/reaction-logo-circular.svg";

const getShop = gql`
  query getShop($id: ID!) {
    shop(id: $id) {
      brandAssets {
        navbarBrandImage {
          large
        }
      }
      name
      shopLogoUrls {
        primaryShopLogoUrl
      }
    }
  }
`;

const styles = (theme) => ({
  root: {
    display: "flex",
    alignItems: "center"
  },
  logo: {
    marginRight: theme.spacing(2)
  },
  logoName: {
    color: theme.palette.colors.black15
  }
});

/**
 * ShopLogoWithData
 * @param {Object} props Component props
 * @returns {Node} React component
 */
function ShopLogoWithData({ classes, shopId, size }) {
  if (!shopId) {
    return (
      <img
        alt="Reaction Commerce"
        className={classes.logo}
        src={defaultLogo}
        width={size}
      />
    );
  }

  return (
    <GenericErrorBoundary>
      <Query query={getShop} variables={{ id: shopId }}>
        {({ loading, data }) => {
          if (loading) return null;
          if (data && data.shop) {
            const { shop } = data;
            const customLogoFromUpload = shop.brandAssets && shop.brandAssets.navbarBrandImage && shop.brandAssets.navbarBrandImage.large;
            const customLogoFromUrlInput = shop.shopLogoUrls && shop.shopLogoUrls.primaryShopLogoUrl;

            return (
              <img
                alt={shop.name}
                className={classes.logo}
                src={customLogoFromUrlInput || customLogoFromUpload || defaultLogo}
                width={size}
              />
            );
          }

          // Return null if the shop data couldn't be found.
          return null;
        }}
      </Query>
    </GenericErrorBoundary>
  );
}

ShopLogoWithData.propTypes = {
  classes: PropTypes.object,
  shopId: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

ShopLogoWithData.defaultProps = {
  size: 60
};

export default compose(
  withPrimaryShopId,
  withComponents,
  withStyles(styles, { name: "RuiShopLogoWithData" })
)(ShopLogoWithData);
