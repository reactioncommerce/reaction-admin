import React, { Fragment } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { Components } from "@reactioncommerce/reaction-components";
import { i18next } from "/client/api";
import ShopLogoWithData from "/imports/client/ui/components/ShopLogoWithData/ShopLogoWithData";
import useIsAppLoading from "/imports/client/ui/hooks/useIsAppLoading.js";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId.js";

/**
 * OperatorLanding
 * @param {Object} props Component props
 * @returns {Node} React component
 */
function OperatorLanding() {
  const [isAppLoading] = useIsAppLoading();
  const [currentShopId] = useCurrentShopId();

  if (isAppLoading) return <Components.Loading />;

  let content;
  if (currentShopId) {
    content = (
      <Fragment>
        <Grid item>
          <Typography align="center" variant="body1">
            {/* eslint-disable-next-line max-len */}
            Use Reaction Admin to manage <Link to="/orders">Orders</Link>, <Link to="/products">Products</Link>, <Link to="/tags">Tags</Link>, <Link to="/accounts">Accounts</Link>, and <Link to="/navigation">Navigation</Link>, or change shop settings.
          </Typography>
        </Grid>
        <Grid item>
          <Typography align="center" variant="body1">
            See our <MuiLink href="https://docs.reactioncommerce.com/docs/dashboard">Store Operator’s Guide</MuiLink> for more information.
          </Typography>
        </Grid>
      </Fragment>
    );
  } else {
    content = (
      <Grid item>
        <Card elevation={0}>
          <CardHeader title={i18next.t("admin.landing.createFirstShop")} />
          <CardContent>
            <Components.CreateFirstShopForm />
          </CardContent>
        </Card>
      </Grid>
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
          <ShopLogoWithData size={100} />
        </Grid>
        {content}
      </Grid>
    </Fragment>
  );
}

export default OperatorLanding;
