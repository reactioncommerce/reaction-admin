import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import i18next from "i18next";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import muiCheckboxOptions from "reacto-form/cjs/muiCheckboxOptions";
import SimpleSchema from "simpl-schema";
import muiOptions from "reacto-form/cjs/muiOptions";
import {
  Box,
  Card,
  Checkbox,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid
} from "@material-ui/core";
import { Button, TextField } from "@reactioncommerce/catalyst";
import useVariantInventory from "./useVariantInventory";

const formSchema = new SimpleSchema({
  inventoryInStock: {
    type: Number,
    optional: true
  },
  lowInventoryWarningThreshold: {
    type: Number,
    optional: true
  },
  canBackorder: Boolean,
  isEnabled: Boolean
});

const validator = formSchema.getFormValidator();

/**
 * Variant inventory form block component
 * @param {Object} props Component props
 * @returns {Node} React node
 */
function VariantInventoryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    currentVariant,
    hasChildVariants,
    inventoryInfo,
    onRecalculateReservedSimpleInventory,
    onUpdateVariantInventoryInfo
  } = useVariantInventory();

  const {
    formData: currentFormData,
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    isDirty,
    submitForm
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);

      await onUpdateVariantInventoryInfo({
        inventoryInput: formSchema.clean(formData)
      });

      setIsSubmitting(false);
    },
    validator(formData) {
      return validator(formSchema.clean(formData));
    },
    value: inventoryInfo
  });

  const { canBackorder, isEnabled } = currentFormData;

  if (!currentVariant) return null;

  const {
    inventoryInStock,
    inventoryReserved
  } = currentFormData;

  let content;
  if (hasChildVariants) {
    content = (
      <Fragment>
        <p>{i18next.t("productVariant.noInventoryTracking")}</p>
      </Fragment>
    );
  } else {
    const inventoryInStockHelperText = isEnabled ? i18next.t("productVariant.inventoryInStockHelpText", {
      inventoryAvailableToSell: Math.max((inventoryInStock || 0) - (inventoryReserved || 0), 0),
      inventoryInStock: (inventoryInStock || 0),
      inventoryReserved: (inventoryReserved || 0)
    }) : i18next.t("productVariant.inventoryDisabled");

    const inventoryInStockInputProps = getInputProps("inventoryInStock", muiOptions);
    const lowInventoryWarningThresholdInputProps = getInputProps("lowInventoryWarningThreshold", muiOptions);

    content = (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitForm();
        }}
      >
        <p>{i18next.t("productVariant.inventoryMessage")}</p>
        <FormControlLabel
          control={<Checkbox />}
          label={i18next.t("productVariant.isInventoryManagementEnabled")}
          {...getInputProps("isEnabled", muiCheckboxOptions)}
        />
        <Grid container spacing={1}>
          <Grid item sm={6}>
            <TextField
              error={hasErrors(["inventoryInStock"])}
              fullWidth
              helperText={getFirstErrorMessage(["inventoryInStock"]) || inventoryInStockHelperText}
              label={i18next.t("productVariant.inventoryInStock")}
              placeholder="0"
              type="number"
              {...inventoryInStockInputProps}
              disabled={!isEnabled}
              value={isEnabled ? inventoryInStockInputProps.value : 0}
            />
            <Button
              disabled={!isEnabled}
              variant="text"
              onClick={() => {
                onRecalculateReservedSimpleInventory();
              }}
              title="Recalculate"
            >{i18next.t("productVariant.recalculateReservedInventory")}</Button>
          </Grid>
          <Grid item sm={6}>
            <TextField
              error={hasErrors(["lowInventoryWarningThreshold"])}
              fullWidth
              helperText={getFirstErrorMessage(["lowInventoryWarningThreshold"]) || i18next.t("productVariant.lowInventoryWarningThresholdLabel")}
              label={i18next.t("productVariant.lowInventoryWarningThreshold")}
              placeholder="0"
              type="number"
              {...lowInventoryWarningThresholdInputProps}
              disabled={!isEnabled}
              value={isEnabled ? lowInventoryWarningThresholdInputProps.value : 0}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item sm={12}>
            <FormControlLabel
              control={<Checkbox />}
              label={i18next.t("productVariant.allowBackorder")}
              {...getInputProps("canBackorder", muiCheckboxOptions)}
              disabled={!isEnabled}
              checked={isEnabled ? canBackorder : true}
            />
          </Grid>
        </Grid>
        <Box textAlign="right">
          <Button
            color="primary"
            disabled={!isDirty || isSubmitting}
            isWaiting={isSubmitting}
            variant="contained"
            type="submit"
          >
            {i18next.t("app.saveChanges")}
          </Button>
        </Box>
      </form>
    );
  }

  return (
    <Card>
      <CardHeader title={i18next.t("productVariant.inventoryHeading")} />
      <CardContent>{content}</CardContent>
    </Card>
  );
}

VariantInventoryForm.propTypes = {
  components: PropTypes.shape({
    Button: PropTypes.any
  })
};

export default VariantInventoryForm;
