import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { makeStyles } from "@material-ui/styles";
import GeneralTaxSettings from "../containers/GeneralTaxSettings";

const useStyles = makeStyles((theme) => ({
  topCard: {
    marginBottom: theme.spacing(2)
  }
}));

/**
 * @summary React component for the main Tax Settings area
 * @returns {Node} React node
 */
export default function TaxSettings() {
  const classes = useStyles();

  return (
    <Card className={classes.topCard}>
      <CardHeader title="Shop Tax Settings" />
      <CardContent>
        <GeneralTaxSettings />
      </CardContent>
    </Card>
  );
}
