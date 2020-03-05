import React from "react";
import { Blocks } from "@reactioncommerce/reaction-components";
import {
  Box,
  makeStyles,
  Typography
} from "@material-ui/core";
import i18next from "i18next";

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
export default function ShippingSettingsRegion(props) {
  const classes = useStyles();
  return (
    <>
      <Typography variant="h2" className={classes.header}>
        {i18next.t("admin.shippingSettings.header")}
      </Typography>
      <Blocks region="ShippingSettings" blockProps={props}>
        { (blocks) =>
          blocks.map((block, index) => (
            <Box paddingBottom={2} key={index}>
              {block}
            </Box>
          ))}
      </Blocks>
    </>
  );
}
