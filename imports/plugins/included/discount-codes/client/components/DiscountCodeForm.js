import React, { useState } from "react";
import PropTypes from "prop-types";
import i18next from "i18next";
import { useMutation } from "@apollo/react-hooks";
import { useSnackbar } from "notistack";
import SimpleSchema from "simpl-schema";
import { Button, TextField, ConfirmDialog } from "@reactioncommerce/catalyst";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
  MenuItem
} from "@material-ui/core";
import muiOptions from "reacto-form/cjs/muiOptions";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import createDiscountCodeGQL from "../graphql/mutations/createDiscountCode";

const useStyles = makeStyles(() => ({
  dialogTitle: {
    fontSize: 18,
    fontWeight: 500
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
    type: String,
    defaultValue: "code"
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { discountCode, onSuccess = () => { }, shopId, isOpen, onCloseDialog } = props;
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
      onCloseDialog();
    },
    onError() {
      setIsSubmitting(false);
      onCloseDialog();
      enqueueSnackbar(i18next.t("admin.discountCodes.failure"), { variant: "warning" });
    }
  });

  const {
    getFirstErrorMessage,
    getInputProps,
    isDirty,
    hasErrors,
    submitForm
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);

      if (discountCode) {
        // Update discount code
      } else {
        console.log("submitting with data: ", formData);
        await createDiscountCode({
          variables: {
            input: {
              discountCode: {
                // In case discountCode has additional fields not allowed, we'll copy just what we want
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
          }
        });
      }
    },
    validator(formData) {
      console.log("data to validate", formData);

      return validator({
        // In case discountCode has additional fields not allowed, we'll copy just what we want
        code: formData.code,
        calculation: {
          method: formData.calculation.method
        },
        conditions: {
          // enabled: formData.conditions.enabled,
          accountLimit: Number(formData.conditions.accountLimit),
          redemptionLimit: Number(formData.conditions.redemptionLimit),
          order: {
            // Set to 0(can be applied infinitely)
            min: 0
          }
        },
        // description: formData.description,
        discountMethod: "code",
        discount: formData.discount
      });
    },
    value: discountCode
  });

  let calculationMethodField;
  if (Array.isArray(calculationMethods) && calculationMethods.length) {
    const options = calculationMethods.map(({ value, label }) => ({ label, value }));
    calculationMethodField = (
      <TextField
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

  const classes = useStyles();

  return (
    <div>
      <Dialog open={isOpen} onClose={onCloseDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <span className={classes.dialogTitle}>
            {i18next.t("admin.discountCode.addDiscountModalTitle")}
          </span>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={hasErrors(["code"])}
                fullWidth
                helperText={getFirstErrorMessage(["code"])}
                label={i18next.t("admin.discountCode.form.code")}
                placeholder={i18next.t("admin.discountCode.form.codePlaceholder")}
                {...getInputProps("code", muiOptions)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={hasErrors(["discount"])}
                fullWidth
                helperText={getFirstErrorMessage(["discount"])}
                label={i18next.t("admin.discountCode.form.discount")}
                placeholder={i18next.t("admin.discountCode.form.discountPlaceholder")}
                {...getInputProps("discount", muiOptions)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={hasErrors(["conditions.accountLimit"])}
                fullWidth
                helperText={getFirstErrorMessage(["conditions.accountLimit"])}
                label={i18next.t("admin.discountCode.form.accountLimit")}
                placeholder={i18next.t("admin.discountCode.form.accountLimitPlaceholder")}
                {...getInputProps("conditions.accountLimit", muiOptions)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={hasErrors(["conditions.redemptionLimit"])}
                fullWidth
                helperText={getFirstErrorMessage(["conditions.redemptionLimit"])}
                label={i18next.t("admin.discountCode.form.redemptionLimit")}
                onKeyPress={(event) => {
                  if (event.key === "Enter") submitForm();
                }}
                placeholder={i18next.t("admin.discountCode.form.redemptionLimitPlaceholder")}
                {...getInputProps("conditions.redemptionLimit", muiOptions)}
              />
            </Grid>
            <Grid item xs={12}>
              {calculationMethodField}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          { !isCreateMode && (
            <ConfirmDialog
              title={i18next.t("admin.discountCode.form.deleteDialogTitle")}
              message={i18next.t("admin.discountCode.form.deleteMessage")}
              onConfirm={() => {
                // deleteDiscountCode({
                //   variables: {
                //     input: {
                //       shopId,
                //       discountCodeId: discountCode._id
                //     }
                //   }
                // });
                console.log("Delete");
                onCloseDialog();
              }}
            >
              {({ openDialog }) => (
                <Button variant="text"
                  disabled={isSubmitting}
                  onClick={openDialog}
                  color="primary"
                >
                  {i18next.t("app.delete")}
                </Button>

              )}
            </ConfirmDialog>
          )}
          <Button variant="outlined" onClick={onCloseDialog} color="primary">
            {i18next.t("app.cancel")}
          </Button>
          <Button
            disabled={isSubmitting || !isDirty}
            onClick={submitForm}
            variant="contained"
            color="primary"
          >
            {i18next.t("app.save")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

DiscountCodeForm.propTypes = {
  /**
   * A discount code record
   */
  discountCode: PropTypes.object,
  /**
   * Determines whether the form dialog is open or not
  */
  isOpen: PropTypes.bool,
  /**
   * Function that closes the form dialog
  */
  onCloseDialog: PropTypes.func,
  /**
   * Function to call after form is successfully submitted
   */
  onSuccess: PropTypes.func,
  /**
   * Shop ID to create/edit tax rate for
   */
  shopId: PropTypes.string
};
