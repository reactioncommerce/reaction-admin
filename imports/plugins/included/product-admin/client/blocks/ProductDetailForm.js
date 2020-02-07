import React, { useState } from "react";
import Alert from "sweetalert2";
import { i18next } from "/client/api";
import {
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
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
import useGenerateSitemaps from "/imports/plugins/included/sitemap-generator/client/hooks/useGenerateSitemaps";
import useProduct from "../hooks/useProduct";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2)
  },
  textField: {
    marginBottom: theme.spacing(4),
    minWidth: 350
  }
}));

const formSchema = new SimpleSchema({
  title: {
    type: String,
    optional: true
  },
  permalink: {
    type: String,
    optional: true
  },
  pageTitle: {
    type: String,
    optional: true
  },
  vendor: {
    type: String,
    optional: true
  },
  description: {
    type: String,
    optional: true
  },
  originCountry: {
    type: String,
    optional: true
  }
});

const validator = formSchema.getFormValidator();

/**
 * @name ProductDetailForm
 * @param {Object} props Component props
 * @returns {React.Component} Product detail form react component
 */
const ProductDetailForm = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    onUpdateProduct,
    product,
    shopId
  } = useProduct();

  const { generateSitemaps } = useGenerateSitemaps(shopId);

  let content;

  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    isDirty,
    submitForm
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);

      await onUpdateProduct({
        product: formSchema.clean(formData)
      });

      setIsSubmitting(false);
    },
    onChange: (formData) => {
      if (formData.shouldAppearInSitemap !== product.shouldAppearInSitemap) {
        if (formData.isVisible && !formData.isDeleted) {
          // If product is published, ask whether to regenerate sitemap
          Alert({
            title: i18next.t("productDetailEdit.refreshSitemap", { defaultValue: "Refresh sitemap now?" }),
            type: "warning",
            showCancelButton: true,
            cancelButtonText: i18next.t("productDetailEdit.refreshSitemapNo", { defaultValue: "No, don't refresh" }),
            confirmButtonText: i18next.t("productDetailEdit.refreshSitemapYes", { defaultValue: "Yes, refresh" })
          })
            .then(({ value }) => {
              if (value) {
                generateSitemaps();
                Alerts.toast(i18next.t("shopSettings.sitemapRefreshInitiated", {
                  defaultValue: "Refreshing the sitemap can take up to 5 minutes. You will be notified when it is completed."
                }), "success");
              }
              return false;
            })
            .catch(() => false);
        }
      }
    },
    validator(formData) {
      return validator(formSchema.clean(formData));
    },
    value: product
  });

  const originCountryInputProps = getInputProps("originCountry", muiOptions);
  const sitemapInputProps = getInputProps("shouldAppearInSitemap", muiOptions);

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
          error={hasErrors(["title"])}
          fullWidth
          helperText={getFirstErrorMessage(["title"])}
          label={i18next.t("productDetailEdit.title")}
          {...getInputProps("title", muiOptions)}
        />
        <TextField
          className={classes.textField}
          error={hasErrors(["slug"])}
          fullWidth
          helperText={getFirstErrorMessage(["slug"])}
          label={i18next.t("productDetailEdit.parmalink")}
          {...getInputProps("slug", muiOptions)}
        />
        <TextField
          className={classes.textField}
          error={hasErrors(["pageTitle"])}
          fullWidth
          helperText={getFirstErrorMessage(["pageTitle"])}
          label={i18next.t("productDetailEdit.pageTitle")}
          {...getInputProps("pageTitle", muiOptions)}
        />
        <TextField
          className={classes.textField}
          error={hasErrors(["vendor"])}
          fullWidth
          helperText={getFirstErrorMessage(["vendor"])}
          label={i18next.t("productDetailEdit.vendor")}
          {...getInputProps("vendor", muiOptions)}
        />
        <TextField
          className={classes.textField}
          error={hasErrors(["description"])}
          fullWidth
          helperText={getFirstErrorMessage(["description"])}
          label={i18next.t("productDetailEdit.description")}
          {...getInputProps("description", muiOptions)}
        />
        {/* <TextField
          className={classes.textField}
          error={hasErrors(["template"])}
          fullWidth
          helperText={getFirstErrorMessage(["template"])}
          label={i18next.t("productDetailEdit.template")}
          variant="outlined"
          {...getInputProps("template", muiOptions)}
        /> */}
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
          {CountryOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          label={i18next.t("productDetailEdit.shouldAppearInSitemap")}
          {...sitemapInputProps}
          checked={sitemapInputProps.value || false}
          control={<Checkbox />}
        />
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
