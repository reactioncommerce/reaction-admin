import React, { useState } from "react";
import i18next from "i18next";
import SimpleSchema from "simpl-schema";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import { makeStyles } from "@material-ui/styles";
import Button from "@reactioncommerce/catalyst/Button";
import TextField from "@reactioncommerce/catalyst/TextField";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import muiOptions from "reacto-form/cjs/muiOptions";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  textField: {
    marginBottom: theme.spacing(4),
    minWidth: 350
  }
}));

const formSchema = new SimpleSchema({
  name: {
    type: String,
    min: 1
  }
});
const validator = formSchema.getFormValidator();

/**
 * Shop settings form block component
 * @returns {Node} React node
 */
function ShopSettings() {
  const classes = useStyles();
  const [currentShopId] = useCurrentShopId();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (args) => {

  };

  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    submitForm
  } = useReactoForm({
    async onSubmit(...args) {
      setIsSubmitting(true);
      await onSubmit(...args);
      setIsSubmitting(false);
    },
    validator
  });

  return (
    <Card className={classes.card}>
      <CardHeader title={i18next.t("admin.settings.general.label")} />
      <CardContent>
        <TextField
          className={classes.textField}
          error={hasErrors(["attributeLabel"])}
          fullWidth
          label="Name"
          placeholder="Enter a name for the shop"
          {...getInputProps("attributeLabel", muiOptions)}
        />
        <Button
          color="primary"
          fullWidth
          disabled={isSubmitting}
          onClick={submitForm}
          variant="contained"
        >
          {isSubmitting ? "Saving settings..." : "Save"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default ShopSettings;
