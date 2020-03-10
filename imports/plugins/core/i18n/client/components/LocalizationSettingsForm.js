import React, { useState } from "react";
import i18next from "i18next";
import SimpleSchema from "simpl-schema";
import { Button, TextField } from "@reactioncommerce/catalyst";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import muiOptions from "reacto-form/cjs/muiOptions";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  CircularProgress,
  Grid,
  makeStyles,
  MenuItem
} from "@material-ui/core";
import useShopSettings from "/imports/plugins/core/dashboard/client/hooks/useShopSettings";
import CountryOptions from "@reactioncommerce/api-utils/CountryOptions.js";
import CurrencyOptions from "@reactioncommerce/api-utils/CurrencyOptions.js";
import LanguageOptions from "@reactioncommerce/api-utils/LanguageOptions.js";
import { convertWeight, convertLength } from "/lib/api";

const unitsOfMeasure = [];
const unitsOfLength = [];
const TimezoneOptions = [];

const useStyles = makeStyles((theme) => ({
  card: {
    overflow: "visible"
  },
  cardActions: {
    justifyContent: "flex-end",
    marginRight: theme.spacing(1)
  }
}));

const localizationSettings = new SimpleSchema({
  "currency": Object,
  "currency.symbol": {
    type: String,
    optional: true
  },
  "baseUOL": {
    type: String,
    optional: true
  },
  "baseUOM": {
    type: String,
    optional: true
  },
  "language": {
    type: String,
    optional: true
  },
  "timezone": {
    type: String,
    optional: true
  }
});

const validator = localizationSettings.getFormValidator();

/**
 * Shop settings form block component
 * @returns {Node} React node
 */
export default function ShopSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading, onUpdateShop, shop } = useShopSettings();
  const classes = useStyles();
  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    isDirty,
    submitForm
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);
      await onUpdateShop(localizationSettings.clean(formData));
      setIsSubmitting(false);
    },
    validator(formData) {
      return validator(localizationSettings.clean(formData));
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

  const currencyInputProps = getInputProps("currency.code", muiOptions);
  const baseUOLInputProps = getInputProps("baseUOL", muiOptions);
  const baseUOMInputProps = getInputProps("baseUOM", muiOptions);
  const languageInputProps = getInputProps("language", muiOptions);
  const timezoneInputProps = getInputProps("timezone", muiOptions);

  return (
    <Card className={classes.card}>
      <CardHeader title={i18next.t("admin.i18nSettings.shopLocalization")} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              error={hasErrors(["currency.code"])}
              fullWidth
              helperText={getFirstErrorMessage(["currency.code"])}
              label={i18next.t("admin.currency")}
              onKeyPress={(event) => {
                if (event.key === "Enter") submitForm();
              }}
              select
              {...currencyInputProps}
            >
              {CurrencyOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={hasErrors(["baseUOL"])}
              fullWidth
              helperText={getFirstErrorMessage(["baseUOL"])}
              label={i18next.t("admin.baseUOL")}
              onKeyPress={(event) => {
                if (event.key === "Enter") submitForm();
              }}
              select
              {...baseUOLInputProps}
              value={baseUOLInputProps.value}
            >
              {unitsOfLength.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={hasErrors(["baseUOM"])}
              fullWidth
              helperText={getFirstErrorMessage(["baseUOM"])}
              label={i18next.t("admin.baseUOM")}
              onKeyPress={(event) => {
                if (event.key === "Enter") submitForm();
              }}
              select
              {...baseUOMInputProps}
            >
              {unitsOfMeasure.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={hasErrors(["language"])}
              fullWidth
              helperText={getFirstErrorMessage(["language"])}
              label={i18next.t("admin.language")}
              onKeyPress={(event) => {
                if (event.key === "Enter") submitForm();
              }}
              select
              {...languageInputProps}
              value={languageInputProps.value}
            >
              {LanguageOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={hasErrors(["timezone"])}
              fullWidth
              helperText={getFirstErrorMessage(["timezone"])}
              label={i18next.t("admin.timezone")}
              onKeyPress={(event) => {
                if (event.key === "Enter") submitForm();
              }}
              select
              {...timezoneInputProps}
              value={timezoneInputProps.value}
            >
              {TimezoneOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={classes.cardActions}>
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
      </CardActions>
    </Card>
  );
}
