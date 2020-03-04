import React, { useState } from "react";
import i18next from "i18next";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  MenuItem
} from "@material-ui/core";
import { Button, TextField } from "@reactioncommerce/catalyst";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import muiCheckboxOptions from "reacto-form/cjs/muiCheckboxOptions";
import SimpleSchema from "simpl-schema";
import muiOptions from "reacto-form/cjs/muiOptions";
import useProduct from "../hooks/useProduct";
import useTaxCodes from "../../../../core/taxes/client/hooks/useTaxCodes";


const formSchema = new SimpleSchema({
  taxCode: {
    type: String,
    optional: true
  },
  isTaxable: {
    type: Boolean,
    optional: true
  },
  taxDescription: {
    type: String,
    optional: true
  }
});

const validator = formSchema.getFormValidator();

/**
 * Variant tax block component
 * @returns {React.Component} A React component
 */
function VariantTaxForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    currentVariant,
    onUpdateProductVariant,
    product,
    shopId
  } = useProduct();

  const taxCodes = useTaxCodes({ shopId });

  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    isDirty,
    submitForm
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);

      await onUpdateProductVariant({
        variantId: currentVariant._id,
        variant: formSchema.clean(formData)
      });

      setIsSubmitting(false);
    },
    validator(formData) {
      return validator(formSchema.clean(formData));
    },
    value: currentVariant
  });

  if (!product) {
    return null;
  }

  let taxCodeField;

  if (Array.isArray(taxCodes) && taxCodes.length) {
    const options = taxCodes.map(({ code, label }) => ({ label, value: code }));
    options.unshift({ label: "None", value: "" });

    const taxCodeInputProps = getInputProps("taxCode", muiOptions);

    taxCodeField = (
      <TextField
        error={hasErrors(["taxCode"])}
        fullWidth
        helperText={getFirstErrorMessage(["taxCode"])}
        label={i18next.t("productVariant.selectTaxCode")}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        select
        {...taxCodeInputProps}
        value={taxCodeInputProps.value || ""}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  } else {
    taxCodeField = (
      <TextField
        error={hasErrors(["taxCode"])}
        fullWidth
        helperText={getFirstErrorMessage(["taxCode"])}
        label={i18next.t("productVariant.taxCode")}
        {...getInputProps("taxCode", muiOptions)}
      />
    );
  }

  return (
    <Card>
      <CardHeader title={i18next.t("productVariant.taxable")} />
      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitForm();
          }}
        >
          <Box marginBottom={4}>
            <FormControlLabel
              label={i18next.t("productVariant.taxable")}
              control={<Checkbox />}
              {...getInputProps("isTaxable", muiCheckboxOptions)}
            />
          </Box>
          <Box marginBottom={4}>
            {taxCodeField}
          </Box>
          <Box marginBottom={4}>
            <TextField
              error={hasErrors(["taxDescription"])}
              fullWidth
              helperText={getFirstErrorMessage(["taxDescription"])}
              label={i18next.t("productVariant.taxDescription")}
              {...getInputProps("taxDescription", muiOptions)}
            />
          </Box>
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
      </CardContent>
    </Card>
  );
}

export default VariantTaxForm;
