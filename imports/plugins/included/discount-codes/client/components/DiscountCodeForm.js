import React, { useState } from "react";
import PropTypes from "prop-types";
import i18next from "i18next";
import { useMutation } from "@apollo/react-hooks";
import { useSnackbar } from "notistack";
import SimpleSchema from "simpl-schema";
import { Button, TextField } from "@reactioncommerce/catalyst";
import {
  Grid,
  makeStyles,
  MenuItem
} from "@material-ui/core";
import muiOptions from "reacto-form/cjs/muiOptions";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import createDiscountCodeGQL from "../graphql/mutations/createDiscountCode";

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
  "code": {
    type: String
  },
  "calculation": Object,
  "calculation.method": {
    type: String
  },
  "conditions": Object,
  "conditions.enabled": {
    type: Boolean,
    optional: true,
    defaultValue: true
  },
  "conditions.accountLimit": {
    type: Number,
    optional: true
  },
  "conditions.redemptionLimit": {
    type: Number,
    optional: true
  },
  "conditions.order": Object,
  "conditions.order.min": {
    type: Number,
    defaultValue: 0
  },
  "description": {
    type: String,
    optional: true
  },
  "discount": {
    type: String,
    optional: true
  },
  "discountMethod": {
    type: String
  }
});
const validator = formSchema.getFormValidator();

/**
 * @summary React component that renders the form for adding, updating, or deleting
 *   a discount code record.
 * @param {Object} props React props
 * @return {React.Node} React node
 */
export default function DiscountCodeForm(props) {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { doc, onSuccess = () => { }, shopId } = props;
  const calculationMethods = [
    { label: "Credit", value: "credit" },
    { label: "Discount", value: "discount" },
    { label: "Sale", value: "sale" },
    { label: "Shipping", value: "shipping" }
  ];

  const [createDiscountCode] = useMutation(createDiscountCodeGQL, {
    ignoreResults: true,
    onCompleted() {
      setIsSubmitting(false);
      onSuccess();
    },
    onError() {
      setIsSubmitting(false);
      enqueueSnackbar(i18next.t("admin.discountCodes.failure"), { variant: "warning" });
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
        // Update discount code
      } else {
        await createDiscountCode({
          variables: {
            input: {
              // In case doc has additional fields not allowed, we'll copy just what we want
              code: formData.code,
              calculation: {
                method: formData.calculation.method
              },
              conditions: {
                enabled: formData.conditions.enabled,
                accountLimit: formData.conditions.accountLimit,
                redemptionLimit: formData.conditions.redemptionLimit,
                order: {
                  // Set to 0(can be applied infinitely)
                  min: 0
                }
              },
              description: formData.description,
              shopId,
              discount: formData.discount,
              discountMethod: formData.discountMethod
            }
          }
        });
      }
    },
    validator(formData) {
      return validator({
        // In case doc has additional fields not allowed, we'll copy just what we want
        code: formData.code,
        calculation: {
          method: formData.calculation.method
        },
        conditions: {
          enabled: formData.conditions.enabled,
          accountLimit: formData.conditions.accountLimit,
          redemptionLimit: formData.conditions.redemptionLimit,
          order: {
            // Set to 0(can be applied infinitely)
            min: 0
          }
        },
        description: formData.description,
        shopId,
        discount: formData.discount,
        discountMethod: formData.discountMethod
      });
    },
    value: doc
  });

  let calculationMethodField;
  if (Array.isArray(calculationMethods) && calculationMethods.length) {
    const options = calculationMethods.map(({ value, label }) => ({ label, value }));
    calculationMethodField = (
      <TextField
        className={classes.textField}
        error={hasErrors(["calculation.method"])}
        fullWidth
        helperText={getFirstErrorMessage(["calculation.method"])}
        label={i18next.t("admin.discountCode.form.calculationMethod")}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        select
        {...getInputProps("calculation.method", muiOptions)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return (
    <div>
      <TextField
        className={classes.textField}
        error={hasErrors(["code"])}
        fullWidth
        helperText={getFirstErrorMessage(["code"])}
        label={i18next.t("admin.discountCode.form.code")}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        placeholder={i18next.t("admin.discountCode.form.codePlaceholder")}
        {...getInputProps("code", muiOptions)}
      />
      {calculationMethodField}
      <Grid className={classes.rightAlignedGrid} item xs={12}>
        {!!doc &&
          <Button
            className={classes.deleteButton}
            color="primary"
            disabled={isSubmitting}
            onClick={() => {
              // deleteDiscountCode({
              //   variables: {
              //     input: {
              //       shopId,
              //       discountCodeId: doc._id
              //     }
              //   }
              // });
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

DiscountCodeForm.propTypes = {
  /**
   * Function to call after form is successfully submitted
   */
  onSuccess: PropTypes.func,
  /**
   * Shop ID to create/edit tax rate for
   */
  shopId: PropTypes.string.isRequired
};
