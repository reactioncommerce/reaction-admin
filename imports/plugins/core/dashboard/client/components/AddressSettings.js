import React from "react";
import { i18next } from "/client/api";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  }
}));

/**
 * Shop address settings form block component
 * @returns {Node} React node
 */
function AddressSettings() {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader title={i18next.t("admin.settings.address.label")} />
      <CardContent>
        Address Settings
      </CardContent>
    </Card>
  );
}

export default AddressSettings;
