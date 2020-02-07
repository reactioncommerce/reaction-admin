import React, { useState } from "react";
import i18next from "i18next";
import SimpleSchema from "simpl-schema";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";
import Button from "@reactioncommerce/catalyst/Button";
import TextField from "@reactioncommerce/catalyst/TextField";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import muiOptions from "reacto-form/cjs/muiOptions";
import useShopSettings from "../hooks/useShopSettings";

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
  },
  emails: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  slug: {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { onUpdateShop } = useShopSettings();

  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    submitForm
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);
      await onUpdateShop(formSchema.clean(formData));
      setIsSubmitting(false);
    },
    validator(formData) {
      return validator(formSchema.clean(formData));
    }
  });

  return (
    <Card className={classes.card}>
      <CardHeader title={i18next.t("admin.settings.general.label")} />
      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitForm();
          }}
        >
          <TextField
            className={classes.textField}
            error={hasErrors(["name"])}
            fullWidth
            helperText={getFirstErrorMessage(["name"])}
            label={i18next.t("admin.settings.address.nameLabel")}
            placeholder={i18next.t("admin.settings.address.namePlaceholder")}
            {...getInputProps("name", muiOptions)}
          />
          <TextField
            className={classes.textField}
            error={hasErrors(["emails"])}
            fullWidth
            helperText={getFirstErrorMessage(["emails"])}
            label={i18next.t("admin.settings.address.emailLabel")}
            placeholder={i18next.t("admin.settings.address.emailPlaceholder")}
            {...getInputProps("emails", muiOptions)}
          />
          <TextField
            className={classes.textField}
            error={hasErrors(["slug"])}
            fullWidth
            helperText={getFirstErrorMessage(["slug"])}
            label={i18next.t("admin.settings.address.slugLabel")}
            placeholder={i18next.t("admin.settings.address.slugPlaceholder")}
            {...getInputProps("slug", muiOptions)}
          />
          <Box textAlign="right">
            <Button
              color="primary"
              disabled={isSubmitting}
              variant="contained"
              type="submit"
            >
              {isSubmitting ? i18next.t("admin.settings.saveProcessing") : i18next.t("app.save")}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}

export default ShopSettings;
