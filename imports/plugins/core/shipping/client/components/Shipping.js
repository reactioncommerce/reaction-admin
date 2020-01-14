import React from "react";
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { Blocks } from "@reactioncommerce/reaction-components";
import { i18next } from "/client/api";
import useCurrentShop from "/imports/client/ui/hooks/useCurrentShop.js";
import DefaultParcelSizeForm from "./DefaultParcelSizeForm.js";

const useStyles = makeStyles((theme) => ({
  topCard: {
    marginBottom: theme.spacing(2)
  }
}));

/**
 * @summary Renders shipping page
 * @param {Object} props Component props
 * @return {React.Node} React node
 */
export default function Shipping(props) {
  const classes = useStyles();
  const { refetchShop, shop } = useCurrentShop();

  if (!shop) return null;

  return (
    <div>
      <h4>Shipping</h4>
      <Card className={classes.topCard}>
        <CardHeader
          title={i18next.t("defaultParcelSize.label")}
        />
        <CardContent>
          <DefaultParcelSizeForm
            doc={shop.defaultParcelSize}
            onSuccess={refetchShop}
            shopId={shop._id}
          />
        </CardContent>
      </Card>
      <Blocks region="ShippingSettings" blockProps={props} />
    </div>
  );
}
