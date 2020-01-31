import React, { useState } from "react";
import { i18next } from "/client/api";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Button,
  Box,
  MenuItem,
  makeStyles
} from "@material-ui/core";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import SimpleSchema from "simpl-schema";
import muiOptions from "reacto-form/cjs/muiOptions";
import CountryOptions from "@reactioncommerce/api-utils/CountryOptions.js";
import TextField from "@reactioncommerce/catalyst/TextField";
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
  price: {
    type: Number,
    optional: true
  },
  compareAtPrice: {
    type: Number,
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
 *
 * @param {*} props
 */
const ProductDetailForm = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    onUpdateProductVariant,
    product,
    variant,
    option
  } = useProduct();

  let content;
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

  if (product) {
    content = (
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
          label={i18next.t("admin.productVariant.optionTitleLabel")}
          placeholder={i18next.t("admin.productVariant.optionTitlePlaceholder")}
          {...getInputProps("optionTitle", muiOptions)}
        />

        <TextField
          className={classes.textField}
          error={hasErrors(["title"])}
          fullWidth
          helperText={getFirstErrorMessage(["title"]) || i18next.t("admin.helpText.title")}
          label={i18next.t("admin.productVariant.titleLabel")}
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
          // Avoid "value must be an array" error
          value={originCountryInputProps.value || []}
        >
          {CountryOptions.map((countryOption) => (
            <MenuItem key={countryOption.value} value={countryOption.value}>
              {countryOption.label}
            </MenuItem>
          ))}
        </TextField>

        <Grid container spacing={1}>
          <Grid item sm={6}>
            <TextField
              className={classes.textField}
              error={hasErrors(["price"])}
              fullWidth
              helperText={getFirstErrorMessage(["price"]) || i18next.t("admin.helpText.price")}
              label={i18next.t("admin.productVariant.priceLabel")}
              placeholder="0.00"
              {...getInputProps("price", muiOptions)}
            />
          </Grid>
          <Grid item sm={6}>
            <TextField
              className={classes.textField}
              error={hasErrors(["compareAtPrice"])}
              fullWidth
              helperText={getFirstErrorMessage(["compareAtPrice"]) || i18next.t("admin.helpText.compareAtPrice")}
              label={i18next.t("admin.productVariant.compareAtPriceLabel")}
              placeholder="0.00"
              {...getInputProps("compareAtPrice", muiOptions)}
            />
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={1}>
          <Grid item sm={6}>
            <TextField
              className={classes.textField}
              error={hasErrors(["width"])}
              fullWidth
              helperText={getFirstErrorMessage(["width"])}
              label={i18next.t("admin.productVariant.width")}
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
              label={i18next.t("admin.productVariant.length")}
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
              label={i18next.t("admin.productVariant.height")}
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
              label={i18next.t("admin.productVariant.weight")}
              placeholder="0"
              {...getInputProps("weight", muiOptions)}
            />
          </Grid>
        </Grid>

        <Box textAlign="right">
          <Button
            color="primary"
            disabled={!isDirty || isSubmitting}
            variant="contained"
            type="submit"
          >
            {i18next.t("app.save")}
          </Button>
        </Box>
      </form>
    );
  }

  return (
    <Card className={classes.card} ref={ref}>
      <CardHeader title={i18next.t("admin.productAdmin.details")} />
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
});

export default ProductDetailForm;
