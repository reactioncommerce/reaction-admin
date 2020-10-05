import React, { Fragment } from "react";
import Helmet from "react-helmet";
import { Link, Redirect, useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { Components } from "@reactioncommerce/reaction-components";
import ShopLogoWithData from "/imports/client/ui/components/ShopLogoWithData/ShopLogoWithData";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId.js";
import useIsAppLoading from "/imports/client/ui/hooks/useIsAppLoading.js";
import useAuth from "/imports/client/ui/hooks/useAuth";

/**
 * OperatorLanding
 * @param {Object} props Component props
 * @returns {Node} React component
 */
function OperatorLanding() {
  const { isViewerLoading, viewer } = useAuth();
  const [shopId] = useCurrentShopId();
  const routeParams = useParams();
  const [isAppLoading] = useIsAppLoading();

  if (isAppLoading || isViewerLoading) return <Components.Loading />;

  if (!routeParams.shopId && viewer?.adminUIShops?.length > 0) {
    return (
      <Redirect to={`/${viewer.adminUIShops[0]._id}`} />
    );
  } else if (!routeParams.shopId && viewer) {
    return (
      <Redirect to={"/new-shop"} />
    );
  }

  return (
    <Fragment>
      <Helmet title="Reaction Admin" />
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={5}
      >
        <Grid item />
        <Grid item>
          <ShopLogoWithData shopId={shopId} size={100} />
        </Grid>

        <Grid item>
          <Typography align="center" variant="body1">
            {/* eslint-disable-next-line max-len */}
            Use Reaction Admin to manage <Link to={`/${shopId}/orders`}>Orders</Link>, <Link to={`/${shopId}/products`}>Products</Link>, <Link to={`/${shopId}/tags`}>Tags</Link>, <Link to={`/${shopId}/accounts`}>Accounts</Link>, and <Link to={`/${shopId}/navigation`}>Navigation</Link>, or change shop settings.
          </Typography>
        </Grid>
        <Grid item>
          <Typography align="center" variant="body1">
            See our <MuiLink href="https://docs.reactioncommerce.com/docs/dashboard">Store Operator’s Guide</MuiLink> for more information.
          </Typography>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default OperatorLanding;
