import React from "react";
import { Blocks } from "@reactioncommerce/reaction-components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { makeStyles } from "@material-ui/styles";
import GeneralTaxSettings from "../containers/GeneralTaxSettings";

const useStyles = makeStyles((theme) => ({
  topCard: {
    marginBottom: theme.spacing(1)
  }
}));

/**
 * @summary React component for the main Tax Settings area
 * @param {Object} props - React props
 * @returns {Node} React node
 */
export default function TaxSettings(props) {
  const classes = useStyles();

  return (
    <div>
      <Card className={classes.topCard}>
        <CardHeader title="Shop Tax Settings" />
        <CardContent>
          <GeneralTaxSettings />
        </CardContent>
      </Card>
      <Blocks region="TaxSettings" blockProps={props} />
    </div>
  );
}
