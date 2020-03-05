import React from "react";
import i18next from "i18next";
import { Blocks } from "@reactioncommerce/reaction-components";
import {
  makeStyles,
  Typography
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  header: {
    marginBottom: theme.spacing(4)
  }
}));

/**
 * @summary Renders payment settings page
 * @param {Object} props Component props
 * @return {React.Node} React node
 */
export default function SystemSettingsRegion(props) {
  const classes = useStyles();
  return (
    <>
      <Typography variant="h2" className={classes.header}>
        {i18next.t("admin.settings.system.header")}
      </Typography>
      <Blocks region="SystemSettings" blockProps={props} />
    </>
  );
}
