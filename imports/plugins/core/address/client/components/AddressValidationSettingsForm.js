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

const createRuleMutation = gql`
  mutation createRuleMutation($input: CreateAddressValidationRuleInput!) {
    createAddressValidationRule(input: $input) {
      addressValidationRule {
        _id
      }
    }
  }
`;

const deleteRuleMutation = gql`
  mutation deleteRuleMutation($input: DeleteAddressValidationRuleInput!) {
    deleteAddressValidationRule(input: $input) {
      addressValidationRule {
        _id
      }
    }
  }
`;

const updateRuleMutation = gql`
  mutation updateRuleMutation($input: UpdateAddressValidationRuleInput!) {
    updateAddressValidationRule(input: $input) {
      addressValidationRule {
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

const formSchema = new SimpleSchema({
  "countryCodes": {
    type: Array,
    optional: true
  },
  "countryCodes.$": String,
  "serviceName": {
    type: String,
    min: 1
  }
});
const validator = formSchema.getFormValidator();

/**
 * @summary React component that renders the form for adding, updating, or deleting
 *   a custom tax rate record.
 * @param {Object} props React props
 * @return {React.Node} React node
 */
export default function AddressValidationSettingsForm(props) {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const {
    doc,
    getSupportedCountryOptionsForService = () => [],
    onSuccess = () => {},
    serviceOptions,
    shopId
  } = props;

  const [createRule] = useMutation(createRuleMutation, {
    ignoreResults: true,
    onCompleted() {
      setIsSubmitting(false);
      onSuccess();
    },
    onError() {
      setIsSubmitting(false);
      enqueueSnackbar(i18next.t("addressValidation.saveFailed"), { variant: "warning" });
    }
  });

  const [deleteRule] = useMutation(deleteRuleMutation, {
    ignoreResults: true,
    onCompleted() {
      setIsSubmitting(false);
      onSuccess();
    },
    onError() {
      setIsSubmitting(false);
      enqueueSnackbar(i18next.t("addressValidation.saveFailed"), { variant: "warning" });
    }
  });

  const [updateRule] = useMutation(updateRuleMutation, {
    ignoreResults: true,
    onCompleted() {
      setIsSubmitting(false);
      onSuccess();
    },
    onError() {
      setIsSubmitting(false);
      enqueueSnackbar(i18next.t("addressValidation.saveFailed"), { variant: "warning" });
    }
  });

  const {
    formData: currentFormData,
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    submitForm
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);

      if (doc) {
        await updateRule({
          variables: {
            input: {
              // In case doc has additional fields not allowed, we'll copy just what we want
              countryCodes: formData.countryCodes || null,
              serviceName: formData.serviceName,
              ruleId: formData._id,
              shopId
            }
          }
        });
      } else {
        await createRule({
          variables: {
            input: {
              // In case doc has additional fields not allowed, we'll copy just what we want
              countryCodes: formData.countryCodes || null,
              serviceName: formData.serviceName,
              shopId
            }
          }
        });
      }
    },
    validator(formData) {
      return validator({
        // Don't include `_id` when we're updating
        countryCodes: formData.countryCodes,
        serviceName: formData.serviceName
      });
    },
    value: doc
  });

  const countryCodesInputProps = getInputProps("countryCodes", muiOptions);

  return (
    <div>
      <TextField
        className={classes.textField}
        error={hasErrors(["serviceName"])}
        fullWidth
        helperText={getFirstErrorMessage(["serviceName"])}
        label={i18next.t("addressValidation.serviceNameLabel")}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        select
        {...getInputProps("serviceName", muiOptions)}
      >
        {serviceOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        className={classes.textField}
        error={hasErrors(["countryCodes"])}
        fullWidth
        helperText={getFirstErrorMessage(["countryCodes"]) || i18next.t("addressValidation.countryCodesHelpText")}
        label={i18next.t("addressValidation.countryCodesLabel")}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        select
        SelectProps={{ multiple: true }}
        {...countryCodesInputProps}
        // Avoid "value must be an array" error
        value={countryCodesInputProps.value || []}
      >
        {getSupportedCountryOptionsForService(currentFormData.serviceName).map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
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
              deleteRule({
                variables: {
                  input: {
                    shopId,
                    ruleId: doc._id
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
          disabled={isSubmitting}
          onClick={submitForm}
          variant="contained"
        >
          {i18next.t("app.save")}
        </Button>
      </Grid>
    </div>
  );
}

AddressValidationSettingsForm.propTypes = {
  /**
   * Document to edit. Provide this to put the form into update mode
   */
  doc: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    countryCodes: PropTypes.arrayOf(PropTypes.string),
    serviceName: PropTypes.string.isRequired
  }),
  /**
   * Function that returns a filtered list of country options
   */
  getSupportedCountryOptionsForService: PropTypes.func,
  /**
   * Function to call after form is successfully submitted
   */
  onSuccess: PropTypes.func,
  /**
   * Options for the `serviceName` field
   */
  serviceOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  /**
   * Shop ID to create/edit/delete address validation rule for
   */
  shopId: PropTypes.string.isRequired
};
