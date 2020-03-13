import React, { useState } from "react";
import PropTypes from "prop-types";
import i18next from "i18next";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useSnackbar } from "notistack";
import SimpleSchema from "simpl-schema";
import Button from "@reactioncommerce/catalyst/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";
import muiOptions from "reacto-form/cjs/muiOptions";
import useReactoForm from "reacto-form/cjs/useReactoForm";

const updateShopMutation = gql`
  mutation updateShopMutation($input: UpdateShopInput!) {
    updateShop(input: $input) {
      shop {
        _id
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  rightAlignedGrid: {
    textAlign: "right"
  },
  textField: {
    marginBottom: theme.spacing(4),
    minWidth: 350
  }
}));

const formSchema = new SimpleSchema({
  weight: {
    type: Number,
    min: 0,
    optional: true
  },
  height: {
    type: Number,
    min: 0,
    optional: true
  },
  length: {
    type: Number,
    min: 0,
    optional: true
  },
  width: {
    type: Number,
    min: 0,
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
export default function DefaultParcelSizeForm(props) {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const {
    doc,
    onSuccess = () => {},
    shopId
  } = props;

  const [updateShop] = useMutation(updateShopMutation, {
    ignoreResults: true,
    onCompleted() {
      setIsSubmitting(false);
      enqueueSnackbar(i18next.t("changesSaved"), { variant: "success" });
      onSuccess();
    },
    onError() {
      setIsSubmitting(false);
      enqueueSnackbar(i18next.t("changesNotSaved"), { variant: "warning" });
    }
  });

  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    isDirty,
    submitForm
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);

      await updateShop({
        variables: {
          input: {
            defaultParcelSize: formSchema.clean(formData),
            shopId
          }
        }
      });
    },
    validator(formData) {
      return validator(formSchema.clean(formData));
    },
    value: doc
  });

  return (
    <div>
      <TextField
        className={classes.textField}
        error={hasErrors(["weight"])}
        fullWidth
        helperText={getFirstErrorMessage(["weight"])}
        label={i18next.t("productVariant.weight")}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        {...getInputProps("weight", muiOptions)}
      />
      <TextField
        className={classes.textField}
        error={hasErrors(["length"])}
        fullWidth
        helperText={getFirstErrorMessage(["length"])}
        label={i18next.t("productVariant.length")}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        {...getInputProps("length", muiOptions)}
      />
      <TextField
        className={classes.textField}
        error={hasErrors(["width"])}
        fullWidth
        helperText={getFirstErrorMessage(["width"])}
        label={i18next.t("productVariant.width")}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        {...getInputProps("width", muiOptions)}
      />
      <TextField
        className={classes.textField}
        error={hasErrors(["height"])}
        fullWidth
        helperText={getFirstErrorMessage(["height"])}
        label={i18next.t("productVariant.height")}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        {...getInputProps("height", muiOptions)}
      />
      <Grid className={classes.rightAlignedGrid} item xs={12}>
        <Button
          color="primary"
          disabled={isSubmitting || !isDirty}
          onClick={submitForm}
          variant="contained"
        >
          {i18next.t("app.saveChanges")}
        </Button>
      </Grid>
    </div>
  );
}

DefaultParcelSizeForm.propTypes = {
  /**
   * Document to edit. Provide this to put the form into update mode
   */
  doc: PropTypes.shape({
    height: PropTypes.number,
    length: PropTypes.number,
    weight: PropTypes.number,
    width: PropTypes.number
  }),
  /**
   * Function to call after form is successfully submitted
   */
  onSuccess: PropTypes.func,
  /**
   * Shop ID to create/edit/delete address validation rule for
   */
  shopId: PropTypes.string.isRequired
};
