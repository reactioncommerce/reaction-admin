import React, { useState } from "react";
import PropTypes from "prop-types";
import i18next from "i18next";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useSnackbar } from "notistack";
import SimpleSchema from "simpl-schema";
import Button from "@reactioncommerce/catalyst/Button";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";
import muiOptions from "reacto-form/cjs/muiOptions";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import CountryOptions from "@reactioncommerce/api-utils/CountryOptions.js";

const createTaxRateMutation = gql`
  mutation createTaxRateMutation($input: CreateTaxRateInput!) {
    createTaxRate(input: $input) {
      taxRate {
        _id
      }
    }
  }
`;

const deleteTaxRateMutation = gql`
  mutation deleteTaxRateMutation($input: DeleteTaxRateInput!) {
    deleteTaxRate(input: $input) {
      taxRate {
        _id
      }
    }
  }
`;

const updateTaxRateMutation = gql`
  mutation updateTaxRateMutation($input: UpdateTaxRateInput!) {
    updateTaxRate(input: $input) {
      taxRate {
        _id
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  deleteButton: {
    marginRight: theme.spacing(1)
  },
  rightAlignedGrid: {
    textAlign: "right"
  },
  textField: {
    marginBottom: theme.spacing(4),
    minWidth: 350
  }
}));

const sourcingOptions = ["destination", "origin"];

const formSchema = new SimpleSchema({
  country: {
    type: String,
    optional: true
  },
  postal: {
    type: String,
    optional: true
  },
  rate: {
    type: Number,
    min: 0,
    exclusiveMin: true
  },
  region: {
    type: String,
    optional: true
  },
  sourcing: {
    type: String,
    allowedValues: sourcingOptions
  },
  taxCode: {
    type: String,
    optional: true
  }
});
const validator = formSchema.getFormValidator();

/**
 * @summary React component that renders the form for adding, updating, or deleting
 *   a custom tax rate record.
 * @param {Object} props React props
 * @return {React.Node} React node
 */
export default function CustomTaxRateForm(props) {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { doc, onSuccess = () => {}, shopId, taxCodes } = props;

  const [createTaxRate] = useMutation(createTaxRateMutation, {
    ignoreResults: true,
    onCompleted() {
      setIsSubmitting(false);
      onSuccess();
    },
    onError() {
      setIsSubmitting(false);
      enqueueSnackbar(i18next.t("admin.taxSettings.shopCustomTaxRatesFailed"), { variant: "warning" });
    }
  });

  const [deleteTaxRate] = useMutation(deleteTaxRateMutation, {
    ignoreResults: true,
    onCompleted() {
      setIsSubmitting(false);
      onSuccess();
    },
    onError() {
      setIsSubmitting(false);
      enqueueSnackbar(i18next.t("admin.taxSettings.shopCustomTaxRatesFailed"), { variant: "warning" });
    }
  });

  const [updateTaxRate] = useMutation(updateTaxRateMutation, {
    ignoreResults: true,
    onCompleted() {
      setIsSubmitting(false);
      onSuccess();
    },
    onError() {
      setIsSubmitting(false);
      enqueueSnackbar(i18next.t("admin.taxSettings.shopCustomTaxRatesFailed"), { variant: "warning" });
    }
  });

  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    submitForm
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);

      if (doc) {
        await updateTaxRate({
          variables: {
            input: {
              // In case doc has additional fields not allowed, we'll copy just what we want
              country: formData.country || null,
              postal: formData.postal || null,
              rate: Number(formData.rate),
              region: formData.region || null,
              shopId,
              sourcing: formData.sourcing,
              taxCode: formData.taxCode,
              taxRateId: formData._id
            }
          }
        });
      } else {
        await createTaxRate({
          variables: {
            input: {
              // In case doc has additional fields not allowed, we'll copy just what we want
              country: formData.country || null,
              postal: formData.postal || null,
              rate: Number(formData.rate),
              region: formData.region || null,
              shopId,
              sourcing: formData.sourcing,
              taxCode: formData.taxCode
            }
          }
        });
      }
    },
    validator(formData) {
      return validator({
        // In case doc has additional fields not allowed, we'll copy just what we want
        country: formData.country || null,
        postal: formData.postal || null,
        rate: Number(formData.rate),
        region: formData.region || null,
        sourcing: formData.sourcing,
        taxCode: formData.taxCode
      });
    },
    value: doc
  });

  let taxCodesField;
  if (Array.isArray(taxCodes) && taxCodes.length) {
    const options = taxCodes.map(({ code, label }) => ({ label, value: code }));
    options.unshift({ label: i18next.t("admin.taxGrid.any"), value: "" });
    taxCodesField = (
      <TextField
        className={classes.textField}
        error={hasErrors(["taxCode"])}
        fullWidth
        helperText={getFirstErrorMessage(["taxCode"])}
        label={i18next.t("admin.taxFormFields.taxCode")}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        select
        {...getInputProps("taxCode", muiOptions)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  } else {
    taxCodesField = (
      <TextField
        className={classes.textField}
        error={hasErrors(["taxCode"])}
        fullWidth
        helperText={getFirstErrorMessage(["taxCode"])}
        label={i18next.t("admin.taxFormFields.taxCode")}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        {...getInputProps("taxCode", muiOptions)}
      />
    );
  }

  return (
    <div>
      <TextField
        className={classes.textField}
        error={hasErrors(["rate"])}
        fullWidth
        helperText={getFirstErrorMessage(["rate"])}
        label={i18next.t("admin.taxFormFields.rate")}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        placeholder={i18next.t("admin.taxFormFields.ratePlaceholder")}
        {...getInputProps("rate", muiOptions)}
      />
      <p>{i18next.t("admin.taxFormHelpText")}</p>
      <TextField
        className={classes.textField}
        error={hasErrors(["country"])}
        fullWidth
        helperText={getFirstErrorMessage(["country"])}
        label={i18next.t("admin.taxFormFields.country")}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        select
        {...getInputProps("country", muiOptions)}
      >
        <MenuItem key="_any" value="">
          {i18next.t("admin.taxGrid.any")}
        </MenuItem>
        {CountryOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        className={classes.textField}
        error={hasErrors(["region"])}
        fullWidth
        helperText={getFirstErrorMessage(["region"])}
        label={i18next.t("admin.taxFormFields.region")}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        {...getInputProps("region", muiOptions)}
      />
      <TextField
        className={classes.textField}
        error={hasErrors(["postal"])}
        fullWidth
        helperText={getFirstErrorMessage(["postal"])}
        label={i18next.t("admin.taxFormFields.postal")}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        {...getInputProps("postal", muiOptions)}
      />
      {taxCodesField}
      <TextField
        className={classes.textField}
        error={hasErrors(["sourcing"])}
        fullWidth
        helperText={getFirstErrorMessage(["sourcing"])}
        label={i18next.t("admin.taxFormFields.sourcing")}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        select
        {...getInputProps("sourcing", muiOptions)}
      >
        {sourcingOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {i18next.t(`admin.taxSourcingOptions.${option}`)}
          </MenuItem>
        ))}
      </TextField>
      <Grid className={classes.rightAlignedGrid} item xs={12}>
        {!!doc &&
          <Button
            className={classes.deleteButton}
            color="primary"
            disabled={isSubmitting}
            onClick={() => {
              deleteTaxRate({
                variables: {
                  input: {
                    shopId,
                    taxRateId: doc._id
                  }
                }
              });
            }}
            variant="contained"
          >
            {i18next.t("app.delete")}
          </Button>}
        <Button
          color="primary"
          isDisabled={isSubmitting}
          onClick={submitForm}
          variant="contained"
        >
          {i18next.t("app.save")}
        </Button>
      </Grid>
    </div>
  );
}

CustomTaxRateForm.propTypes = {
  /**
   * Document to edit. Provide this to put the form into update mode
   */
  doc: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    country: PropTypes.string,
    postal: PropTypes.string,
    rate: PropTypes.number,
    region: PropTypes.string,
    sourcing: PropTypes.string,
    taxCode: PropTypes.string
  }),
  /**
   * Function to call after form is successfully submitted
   */
  onSuccess: PropTypes.func,
  /**
   * Shop ID to create/edit tax rate for
   */
  shopId: PropTypes.string.isRequired,
  /**
   * Optional list of all defined tax codes. If provided,
   * the "tax code" field will be a Select instead
   */
  taxCodes: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }))
};
