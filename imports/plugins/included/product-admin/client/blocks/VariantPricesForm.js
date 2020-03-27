import React, { useState } from "react";
import { i18next } from "/client/api";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Box,
  makeStyles,
  Typography
} from "@material-ui/core";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import SimpleSchema from "simpl-schema";
import muiOptions from "reacto-form/cjs/muiOptions";
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
  "price": {
    type: Number,
    optional: true
  },
  "compareAtPrice": Object,
  "compareAtPrice.amount": {
    type: Number,
    optional: true
  }
});

const validator = formSchema.getFormValidator();

/**
 * @name VariantPricesForm
 * @param {Object} props Component props
 * @param {Object} ref Forwarded ref
 * @returns {React.Component} Variant form React component
 */
const VariantPricesForm = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    currentVariant,
    onUpdateProductVariantPrices,
    product
  } = useProduct();

  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    isDirty,
    submitForm
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);

      await onUpdateProductVariantPrices({
        variantId: currentVariant._id,
        variantPrices: formSchema.clean(formData)
      });

      setIsSubmitting(false);
    },
    validator(formData) {
      return validator(formSchema.clean(formData));
    },
    value: (currentVariant && currentVariant.pricing) || {}
  });

  const isSaveDisabled = !product || !isDirty || isSubmitting;

  return (
    <Card className={classes.card} ref={ref}>
      <CardHeader title={i18next.t("productVariant.prices")} />
      <CardContent>
        { currentVariant && Array.isArray(currentVariant.options) &&
          (currentVariant.options.length > 0) ?
          <span>
            {i18next.t("productVariant.noPriceTracking")}
          </span>
          :
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitForm();
            }}
          >
            <Grid container spacing={1}>
              <Grid item sm={6}>
                <TextField
                  type="numeric"
                  className={classes.textField}
                  error={hasErrors(["price"])}
                  fullWidth
                  helperText={getFirstErrorMessage(["price"]) || i18next.t("admin.helpText.price")}
                  label={i18next.t("productVariant.price")}
                  placeholder="0.00"
                  {...getInputProps("price", muiOptions)}
                />
              </Grid>
              <Grid item sm={6}>
                <TextField
                  type="numeric"
                  className={classes.textField}
                  error={hasErrors(["compareAtPrice.amount"])}
                  fullWidth
                  helperText={getFirstErrorMessage(["compareAtPrice.amount"]) || i18next.t("admin.helpText.compareAtPrice")}
                  label={i18next.t("productVariant.compareAtPrice")}
                  placeholder="0.00"
                  {...getInputProps("compareAtPrice.amount", muiOptions)}
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" alignItems="center">
              {!isSaveDisabled &&
              <Box paddingRight={2}>
                <Typography>
                  {i18next.t("productVariant.pricePublishWarning")}
                </Typography>
              </Box>
              }
              <Button
                color="primary"
                disabled={isSaveDisabled}
                isWaiting={isSubmitting}
                type="submit"
                variant="contained"
              >
                {i18next.t("app.saveChanges")}
              </Button>
            </Box>
          </form>
        }
      </CardContent>
    </Card>
  );
});

export default VariantPricesForm;
