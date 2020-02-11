import React, { useState } from "react";
import i18next from "i18next";
import SimpleSchema from "simpl-schema";
import Button from "@reactioncommerce/catalyst/Button";
import TextField from "@reactioncommerce/catalyst/TextField";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import muiOptions from "reacto-form/cjs/muiOptions";
import muiCheckboxOptions from "reacto-form/esm/muiCheckboxOptions";
import {
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  FormControlLabel,
  Grid,
  makeStyles
} from "@material-ui/core";
import ChevronUp from "mdi-material-ui/ChevronUp";
import useShopSettings from "../hooks/useShopSettings";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  textField: {
    minWidth: 350
  },
  saveButton: {
    textAlign: "right"
  }
}));

const addressSettings = new SimpleSchema({
  company: {
    type: String,
    optional: true
  },
  fullName: {
    type: String,
    min: 1
  },
  address1: {
    type: String,
    min: 1
  },
  address2: {
    type: String,
    optional: true
  },
  city: {
    type: String,
    min: 1
  },
  region: {
    type: String,
    min: 1
  },
  postal: {
    type: String,
    min: 1
  },
  country: {
    type: String,
    min: 1
  },
  phone: {
    type: String,
    regEx: SimpleSchema.RegEx.Phone
  },
  isCommercial: {
    type: Boolean,
    defaultValue: false
  }
});

const validator = addressSettings.getFormValidator();

/**
 * Shop address settings form block component
 * @returns {Node} React node
 */
function AddressSettings() {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { onUpdateShop, refetch, shop } = useShopSettings();

  let initialValues = {};
  if (shop.addressBook) {
    initialValues = { value: shop.addressBook[0] };
  }

  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    submitForm
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);
      await onUpdateShop({ addressBook: [addressSettings.clean(formData)] });
      refetch();
      setIsSubmitting(false);
    },
    validator(formData) {
      return validator(addressSettings.clean(formData));
    },
    ...initialValues
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    submitForm();
  };

  return (
    <Card className={classes.card}>
      <CardHeader title={i18next.t("admin.settings.address.label")} />
      <CardContent>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ChevronUp />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            Manage the shop's physical mailing address.
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  error={hasErrors(["company"])}
                  fullWidth
                  helperText={getFirstErrorMessage(["company"])}
                  label={i18next.t("admin.settings.address.companyLabel")}
                  {...getInputProps("company", muiOptions)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  error={hasErrors(["fullName"])}
                  fullWidth
                  helperText={getFirstErrorMessage(["fullName"])}
                  label={i18next.t("admin.settings.address.fullNameLabel")}
                  placeholder={i18next.t("admin.settings.address.fullNamePlaceholder")}
                  {...getInputProps("fullName", muiOptions)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  error={hasErrors(["address1"])}
                  fullWidth
                  helperText={getFirstErrorMessage(["address1"])}
                  label={i18next.t("admin.settings.address.address1Label")}
                  {...getInputProps("address1", muiOptions)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  error={hasErrors(["address2"])}
                  fullWidth
                  helperText={getFirstErrorMessage(["address2"])}
                  label={i18next.t("admin.settings.address.address2Label")}
                  {...getInputProps("address2", muiOptions)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  error={hasErrors(["city"])}
                  fullWidth
                  helperText={getFirstErrorMessage(["city"])}
                  label={i18next.t("admin.settings.address.cityLabel")}
                  {...getInputProps("city", muiOptions)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={classes.textField}
                  error={hasErrors(["region"])}
                  helperText={getFirstErrorMessage(["region"])}
                  label={i18next.t("admin.settings.address.regionLabel")}
                  {...getInputProps("region", muiOptions)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className={classes.textField}
                  error={hasErrors(["postal"])}
                  helperText={getFirstErrorMessage(["postal"])}
                  label={i18next.t("admin.settings.address.postalLabel")}
                  {...getInputProps("postal", muiOptions)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  error={hasErrors(["country"])}
                  fullWidth
                  helperText={getFirstErrorMessage(["country"])}
                  label={i18next.t("admin.settings.address.countryLabel")}
                  {...getInputProps("country", muiOptions)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  error={hasErrors(["phone"])}
                  fullWidth
                  helperText={getFirstErrorMessage(["phone"])}
                  label={i18next.t("admin.settings.address.phoneLabel")}
                  {...getInputProps("phone", muiOptions)}
                />
              </Grid>
              <Grid item sm={12}>
                <FormControlLabel
                  control={
                    <Checkbox color="primary" />
                  }
                  label={i18next.t("admin.settings.address.isCommercialLabel")}
                  {...getInputProps("isCommercial", muiCheckboxOptions)}
                />
              </Grid>
              <Grid classes={{ root: classes.saveButton }} item xs={12}>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  onClick={handleSubmit}
                  type="submit"
                >
                  {isSubmitting ? i18next.t("admin.settings.saveProcessing") : i18next.t("app.save")}
                </Button>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </CardContent>
    </Card>
  );
}

export default AddressSettings;
