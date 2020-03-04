import React, { useState } from "react";
import { i18next } from "/client/api";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Box,
  MenuItem,
  makeStyles
} from "@material-ui/core";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import SimpleSchema from "simpl-schema";
import muiOptions from "reacto-form/cjs/muiOptions";
import CountryOptions from "@reactioncommerce/api-utils/CountryOptions.js";
import { Button, TextField } from "@reactioncommerce/catalyst";
import useProduct from "../hooks/useProduct";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2)
  },
  textField: {
    marginBottom: theme.spacing(4)
  }
}));

const formSchema = new SimpleSchema({
  title: {
    type: String,
    optional: true
  },
  optionTitle: {
    type: String,
    optional: true
  },
  attributeLabel: {
    type: String,
    optional: true
  },
  originCountry: {
    type: String,
    optional: true
  },
  length: {
    type: Number,
    optional: true
  },
  width: {
    type: Number,
    optional: true
  },
  height: {
    type: Number,
    optional: true
  },
  weight: {
    type: Number,
    optional: true
  }
});

const validator = formSchema.getFormValidator();

/**
 * @name VariantDetailForm
 * @param {Object} props Component props
 * @param {Object} ref Forwarded ref
 * @returns {React.Component} Variant form React component
 */
const VariantDetailForm = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    onUpdateProductVariant,
    product,
    variant,
    option
  } = useProduct();

  const editingVariant = option || variant;

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
        variantId: editingVariant._id,
        variant: formSchema.clean(formData)
      });

      setIsSubmitting(false);
    },
    validator(formData) {
      return validator(formSchema.clean(formData));
    },
    value: editingVariant
  });

  const originCountryInputProps = getInputProps("originCountry", muiOptions);

  return (
    <Card className={classes.card} ref={ref}>
      <CardHeader title={i18next.t("admin.productAdmin.details")} />
      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitForm();
          }}
        >
          <TextField
            className={classes.textField}
            error={hasErrors(["attributeLabel"])}
            fullWidth
            helperText={getFirstErrorMessage(["attributeLabel"]) || i18next.t("admin.helpText.attributeLabel")}
            label={i18next.t("admin.productVariant.attributeLabelLabel")}
            placeholder={i18next.t("admin.productVariant.attributeLabelPlaceholder")}
            {...getInputProps("attributeLabel", muiOptions)}
          />

          <TextField
            className={classes.textField}
            error={hasErrors(["optionTitle"])}
            fullWidth
            helperText={getFirstErrorMessage(["optionTitle"]) || i18next.t("admin.helpText.optionTitle")}
            label={i18next.t("productVariant.optionTitle")}
            placeholder={i18next.t("admin.productVariant.optionTitlePlaceholder")}
            {...getInputProps("optionTitle", muiOptions)}
          />

          <TextField
            className={classes.textField}
            error={hasErrors(["title"])}
            fullWidth
            helperText={getFirstErrorMessage(["title"]) || i18next.t("admin.helpText.title")}
            label={i18next.t("productVariant.title")}
            placeholder={i18next.t("admin.productVariant.titlePlaceholder")}
            {...getInputProps("title", muiOptions)}
          />

          <TextField
            className={classes.textField}
            error={hasErrors(["originCountry"])}
            fullWidth
            helperText={getFirstErrorMessage(["originCountry"])}
            label={i18next.t("productDetailEdit.originCountry")}
            onKeyPress={(event) => {
              if (event.key === "Enter") submitForm();
            }}
            select
            {...originCountryInputProps}
            value={originCountryInputProps.value || ""}
          >
            {CountryOptions.map((countryOption) => (
              <MenuItem key={countryOption.value} value={countryOption.value}>
                {countryOption.label}
              </MenuItem>
            ))}
          </TextField>
          <Box paddingBottom={4}>
            <Divider />
          </Box>
          <Grid container spacing={1}>
            <Grid item sm={6}>
              <TextField
                className={classes.textField}
                error={hasErrors(["width"])}
                fullWidth
                helperText={getFirstErrorMessage(["width"])}
                label={i18next.t("productVariant.width")}
                placeholder="0"
                {...getInputProps("width", muiOptions)}
              />
            </Grid>
            <Grid item sm={6}>
              <TextField
                className={classes.textField}
                error={hasErrors(["length"])}
                fullWidth
                helperText={getFirstErrorMessage(["length"])}
                label={i18next.t("productVariant.length")}
                placeholder="0"
                {...getInputProps("length", muiOptions)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item sm={6}>
              <TextField
                className={classes.textField}
                error={hasErrors(["height"])}
                fullWidth
                helperText={getFirstErrorMessage(["height"])}
                label={i18next.t("productVariant.height")}
                placeholder="0"
                {...getInputProps("height", muiOptions)}
              />
            </Grid>
            <Grid item sm={6}>
              <TextField
                className={classes.textField}
                error={hasErrors(["weight"])}
                fullWidth
                helperText={getFirstErrorMessage(["v"])}
                label={i18next.t("productVariant.weight")}
                placeholder="0"
                {...getInputProps("weight", muiOptions)}
              />
            </Grid>
          </Grid>

          <Box textAlign="right">
            <Button
              color="primary"
              disabled={!product || !isDirty || isSubmitting}
              isWaiting={isSubmitting}
              type="submit"
              variant="contained"
            >
              {i18next.t("app.saveChanges")}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
});

export default VariantDetailForm;
