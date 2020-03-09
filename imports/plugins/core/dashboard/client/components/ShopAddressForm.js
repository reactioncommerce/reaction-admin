import React, { useState } from "react";
import PropTypes from "prop-types";
import i18next from "i18next";
import SimpleSchema from "simpl-schema";
import Button from "@reactioncommerce/catalyst/Button";
import TextField from "@reactioncommerce/catalyst/TextField";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import muiOptions from "reacto-form/cjs/muiOptions";
import muiCheckboxOptions from "reacto-form/esm/muiCheckboxOptions";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid
} from "@material-ui/core";
import useShopSettings from "../hooks/useShopSettings";

const shopAddress = new SimpleSchema({
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

const validator = shopAddress.getFormValidator();

/**
 * Shop address settings form block component
 * @param {Object} props component props
 * @returns {Node} React node
 */
function ShopAddressForm({ isEditMode, isInitialView, setIsEditMode }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { onUpdateShop, shop } = useShopSettings();

  const dialogTitle = isInitialView ?
    i18next.t("admin.settings.address.addNewAddress")
    :
    i18next.t("admin.settings.address.editAddress");

  let initialValues = {};
  if (shop.addressBook) {
    initialValues = { value: shop.addressBook[0] };
  }

  const {
    getFirstErrorMessage,
    getInputProps,
    isDirty,
    hasErrors,
    submitForm
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);
      await onUpdateShop({ addressBook: [shopAddress.clean(formData)] });
      setIsSubmitting(false);
      setIsEditMode(false);
    },
    validator(formData) {
      return validator(shopAddress.clean(formData));
    },
    ...initialValues
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    submitForm();
  };

  const handleOnCloseDialog = () => {
    setIsEditMode(false);
  };

  return (
    <Dialog
      open={isEditMode}
      onClose={handleOnCloseDialog}
      aria-labelledby="shop-address-dialog-title"
    >
      <DialogTitle disableTypography id="shop-address-dialog-title">
        <h4>{dialogTitle}</h4>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              error={hasErrors(["company"])}
              fullWidth
              helperText={getFirstErrorMessage(["company"])}
              label={i18next.t("admin.settings.address.companyLabel")}
              {...getInputProps("company", muiOptions)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
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
              error={hasErrors(["address1"])}
              fullWidth
              helperText={getFirstErrorMessage(["address1"])}
              label={i18next.t("admin.settings.address.address1Label")}
              {...getInputProps("address1", muiOptions)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={hasErrors(["address2"])}
              fullWidth
              helperText={getFirstErrorMessage(["address2"])}
              label={i18next.t("admin.settings.address.address2Label")}
              {...getInputProps("address2", muiOptions)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={hasErrors(["city"])}
              fullWidth
              helperText={getFirstErrorMessage(["city"])}
              label={i18next.t("admin.settings.address.cityLabel")}
              {...getInputProps("city", muiOptions)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={hasErrors(["region"])}
              helperText={getFirstErrorMessage(["region"])}
              label={i18next.t("admin.settings.address.regionLabel")}
              {...getInputProps("region", muiOptions)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={hasErrors(["postal"])}
              helperText={getFirstErrorMessage(["postal"])}
              label={i18next.t("admin.settings.address.postalLabel")}
              {...getInputProps("postal", muiOptions)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={hasErrors(["country"])}
              fullWidth
              helperText={getFirstErrorMessage(["country"])}
              label={i18next.t("admin.settings.address.countryLabel")}
              {...getInputProps("country", muiOptions)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleOnCloseDialog}>
            Cancel
        </Button>
        <Button
          color="primary"
          disabled={isSubmitting || !isDirty}
          variant="contained"
          onClick={handleSubmit}
          type="submit"
        >
          {isSubmitting ? i18next.t("app.settings.saveProcessing") : i18next.t("app.saveChanges")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ShopAddressForm.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  isInitialView: PropTypes.bool.isRequired,
  setIsEditMode: PropTypes.func.isRequired
};

export default ShopAddressForm;
