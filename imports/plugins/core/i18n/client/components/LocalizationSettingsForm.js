import React, { useState } from "react";
import i18next from "i18next";
import SimpleSchema from "simpl-schema";
import { Button, TextField } from "@reactioncommerce/catalyst";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import muiOptions from "reacto-form/cjs/muiOptions";
import moment from "moment-timezone";
import _ from "lodash";
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
import CurrencyOptions from "@reactioncommerce/api-utils/CurrencyOptions.js";
import LanguageOptions from "@reactioncommerce/api-utils/LanguageOptions.js";
import getUnitOptions from "../helpers/getUnitOptions";
import { convertWeight, convertLength } from "/lib/api";

const timezoneOptions = [];
const timezones = moment.tz.names();
for (const timezone of timezones) {
  timezoneOptions.push({
    value: timezone,
    label: timezone
  });
}

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
  "currency.code": {
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

  const unitsOfLength = getUnitOptions("uol", shop.unitsOfLength);
  const unitsOfMeasure = getUnitOptions("uom", shop.unitsOfMeasure);

  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    isDirty,
    submitForm
  } = useReactoForm({
    async onSubmit(userInput) {
      setIsSubmitting(true);

      // Flatten currency object
      const cleanedUserInput = _.clone(localizationSettings.clean(userInput));
      const { currency: { code } } = cleanedUserInput;
      cleanedUserInput.currency = code;

      // Only update default parcel size when UOL/UOM are changed by the user
      if (userInput.baseUOL !== shop.baseUOL || userInput.baseUOM !== shop.baseUOM) {
        const parcelSize = {
          weight: convertWeight(shop.baseUOM, userInput.baseUOM, shop.defaultParcelSize.weight),
          height: convertLength(shop.baseUOL, userInput.baseUOL, shop.defaultParcelSize.height),
          length: convertLength(shop.baseUOL, userInput.baseUOL, shop.defaultParcelSize.length),
          width: convertLength(shop.baseUOL, userInput.baseUOL, shop.defaultParcelSize.width)
        };
        cleanedUserInput.defaultParcelSize = parcelSize;
      }

      await onUpdateShop(cleanedUserInput);
      setIsSubmitting(false);
    },
    validator(userInput) {
      return validator(localizationSettings.clean(userInput));
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
              {timezoneOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
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
              value={currencyInputProps.value}
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
              value={baseUOMInputProps.value}
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
