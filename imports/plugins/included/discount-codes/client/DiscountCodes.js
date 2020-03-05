import React from "react";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { i18next } from "/client/api";
import ReactComponentOrBlazeTemplate from "/imports/plugins/core/components/lib/ReactComponentOrBlazeTemplate";
import useCurrentInternalShopId from "/imports/client/ui/hooks/useCurrentInternalShopId.js";

const useStyles = makeStyles((theme) => ({
  topCard: {
    marginBottom: theme.spacing(2)
  }
}));

/**
 * @summary Renders discounts page
 * @param {Object} props Component props
 * @return {React.Node} React node
 */
export default function DiscountCodes(props) {
  const classes = useStyles();
  const [internalShopId] = useCurrentInternalShopId();

  return (
    <Card className={classes.topCard}>
      <CardHeader
        title={i18next.t("admin.paymentSettings.codesLabel")}
      />
      <CardContent>
        <ReactComponentOrBlazeTemplate name="customDiscountCodes" props={{ ...props, shopId: internalShopId }} />
      </CardContent>
    </Card>
  );
}
