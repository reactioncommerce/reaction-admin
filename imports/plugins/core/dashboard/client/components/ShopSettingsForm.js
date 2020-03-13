import React, { useState } from "react";
import i18next from "i18next";
import SimpleSchema from "simpl-schema";
import Button from "@reactioncommerce/catalyst/Button";
import TextField from "@reactioncommerce/catalyst/TextField";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import muiCheckboxOptions from "reacto-form/esm/muiCheckboxOptions";
import muiOptions from "reacto-form/cjs/muiOptions";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControlLabel,
  Grid,
  Switch
} from "@material-ui/core";
import useShopSettings from "../hooks/useShopSettings";

const shopSettings = new SimpleSchema({
  "allowGuestCheckout": {
    type: Boolean,
    optional: true
  },
  "name": {
    type: String,
    min: 1
  },
  "emails": {
    type: Array,
    optional: true
  },
  "emails.$": new SimpleSchema({
    address: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    }
  }),
  "slug": {
    type: String,
    min: 1
  },
  "description": {
    type: String,
    optional: true
  },
  "keywords": {
    type: String,
    optional: true
  }
});

const validator = shopSettings.getFormValidator();

/**
 * Shop settings form block component
 * @returns {Node} React node
 */
export default function ShopSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading, onUpdateShop, shop } = useShopSettings();
  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    isDirty,
    submitForm
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);
      await onUpdateShop(shopSettings.clean(formData));
      setIsSubmitting(false);
    },
    validator(formData) {
      return validator(shopSettings.clean(formData));
    },
    value: shop
  });

  if (loading) {
    return (
      <Box textAlign="center">
        <CircularProgress variant="indeterminate" color="primary" />
      </Box>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    submitForm();
  };

  return (
    <Card>
      <CardHeader title={i18next.t("admin.settings.shop.label")} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              error={hasErrors(["name"])}
              fullWidth
              helperText={getFirstErrorMessage(["name"])}
              label={i18next.t("admin.settings.shop.nameLabel")}
              placeholder={i18next.t("admin.settings.shop.namePlaceholder")}
              {...getInputProps("name", muiOptions)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={hasErrors(["emails[0].address"])}
              fullWidth
              helperText={getFirstErrorMessage(["emails[0].address"])}
              label={i18next.t("admin.settings.shop.emailLabel")}
              placeholder={i18next.t("admin.settings.shop.emailPlaceholder")}
              {...getInputProps("emails[0].address", muiOptions)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={hasErrors(["slug"])}
              fullWidth
              helperText={getFirstErrorMessage(["slug"])}
              label={i18next.t("admin.settings.shop.slugLabel")}
              placeholder={i18next.t("admin.settings.shop.slugPlaceholder")}
              {...getInputProps("slug", muiOptions)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={hasErrors(["description"])}
              fullWidth
              multiline
              rows={2}
              helperText={getFirstErrorMessage(["description"])}
              label={i18next.t("admin.settings.shop.descriptionLabel")}
              placeholder={i18next.t("admin.settings.shop.descriptionPlaceholder")}
              {...getInputProps("description", muiOptions)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={hasErrors(["keywords"])}
              fullWidth
              helperText={getFirstErrorMessage(["keywords"])}
              label={i18next.t("admin.settings.shop.keywordsLabel")}
              placeholder={i18next.t("admin.settings.shop.keywordsPlaceholder")}
              {...getInputProps("keywords", muiOptions)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch color="primary" />
              }
              label={i18next.t("admin.settings.shop.allowGuestCheckout")}
              {...getInputProps("allowGuestCheckout", muiCheckboxOptions)}
            />
          </Grid>
        </Grid>
        <Box textAlign="right">
          <Button
            color="primary"
            disabled={isSubmitting || !isDirty}
            variant="contained"
            type="submit"
            onClick={handleSubmit}
            isWaiting={isSubmitting}
          >
            {i18next.t("app.saveChanges")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
