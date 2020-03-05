import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  makeStyles,
  Typography
} from "@material-ui/core";
import i18next from "i18next";
import useCurrentShop from "/imports/client/ui/hooks/useCurrentShop.js";
import DefaultParcelSizeForm from "./DefaultParcelSizeForm.js";

const useStyles = makeStyles((theme) => ({
  header: {
    marginBottom: theme.spacing(4)
  },
  topCard: {
    marginBottom: theme.spacing(2)
  }
}));

/**
 * @summary Renders shipping page
 * @return {React.Node} React node
 */
export default function Shipping() {
  const classes = useStyles();
  const { refetchShop, shop } = useCurrentShop();

  if (!shop) return null;

  return (
    <>
      <Typography variant="h2" className={classes.header}>
        {i18next.t("admin.shippingSettings.header")}
      </Typography>
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
    </>
  );
}
