import React from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import classNames from "classnames";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Link, useParams } from "react-router-dom";
import InputBase from "@material-ui/core/InputBase";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { withComponents } from "@reactioncommerce/components-context";
import withPrimaryShopId from "/imports/plugins/core/graphql/lib/hocs/withPrimaryShopId";
import GenericErrorBoundary from "../GenericErrorBoundary";

const defaultLogo = "/resources/reaction-logo-circular.svg";

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

const ShopSelectorInput = withStyles(() => ({
  input: {
    "border": "none",
    "&:focus": {
      border: "none",
      background: "transparent"
    }
  }
}))(InputBase);

/**
 * ShopLogoWithData
 * @param {Object} props Component props
 * @returns {Node} React component
 */
function ShopLogoWithData({ className, classes, shopId, shouldShowShopName, linkTo, size, viewer }) {
  let adminUIShops = [];

  if (viewer?.adminUIShops) {
    ({ adminUIShops } = viewer);
  } else {
    return (
      <Link
        className={classNames(classes.root, className)}
        to={linkTo}
      >
        <img
          alt="Reaction Commerce"
          className={classes.logo}
          src={defaultLogo}
          width={size}
        />
        {shouldShowShopName &&
        <Typography
          variant="h3"
          component="span"
          className={classes.logoName}
        >
          Reaction Commerce
        </Typography>
        }
      </Link>
    );
  }

  return (
    <Select value={shopId} input={<ShopSelectorInput />}>
      {adminUIShops.map((shop) => {
        const customLogoFromUpload = shop.brandAssets && shop.brandAssets.navbarBrandImage && shop.brandAssets.navbarBrandImage.large;
        const customLogoFromUrlInput = shop.shopLogoUrls && shop.shopLogoUrls.primaryShopLogoUrl;

        return (
          <MenuItem value={shop._id}>
            <Link
              className={classNames(classes.root, className)}
              to={`/${shop._id}/`}
            >
              <img
                alt={shop.name}
                className={classes.logo}
                src={customLogoFromUrlInput || customLogoFromUpload || defaultLogo}
                width={size}
              />
              {shouldShowShopName &&
                <Typography
                  variant="h3"
                  component="span"
                  className={classes.logoName}
                >
                  {shop.name}
                </Typography>
              }
            </Link>
          </MenuItem>
        );
      })}
    </Select>
  );
}

ShopLogoWithData.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  linkTo: PropTypes.string,
  shopId: PropTypes.string,
  shouldShowShopName: PropTypes.bool,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  viewer: PropTypes.object
};

ShopLogoWithData.defaultProps = {
  linkTo: "/",
  shouldShowShopName: false,
  size: 60
};

export default compose(
  withPrimaryShopId,
  withComponents,
  withStyles(styles, { name: "RuiShopLogoWithData" })
)(ShopLogoWithData);
