import React, { useState } from "react";
import PropTypes from "prop-types";
import SimpleSchema from "simpl-schema";
import Button from "@reactioncommerce/catalyst/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core";
import muiOptions from "reacto-form/cjs/muiOptions";
import useReactoForm from "reacto-form/cjs/useReactoForm";

const useStyles = makeStyles((theme) => ({
  textField: {
    marginBottom: theme.spacing(4),
    minWidth: 350
  }
}));

const formSchema = new SimpleSchema({
  name: {
    type: String,
    min: 1
  }
});
const validator = formSchema.getFormValidator();

/**
 * CreateFirstShopForm
 * @param {Object} props Component props
 * @returns {Node} React component
 */
function CreateFirstShopForm(props) {
  const { onSubmit } = props;

  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    submitForm
  } = useReactoForm({
    async onSubmit(...args) {
      setIsSubmitting(true);
      await onSubmit(...args);
      setIsSubmitting(false);
    },
    validator
  });

  return (
    <div>
      <TextField
        className={classes.textField}
        label="Shop name"
        error={hasErrors(["name"])}
        fullWidth
        helperText={getFirstErrorMessage(["name"])}
        onKeyPress={(event) => {
          if (event.key === "Enter") submitForm();
        }}
        {...getInputProps("name", muiOptions)}
      />
      <Button
        color="primary"
        fullWidth
        disabled={isSubmitting}
        onClick={submitForm}
        variant="contained"
      >
        {isSubmitting ? "Creating Shop..." : "Create Shop"}
      </Button>
    </div>
  );
}

CreateFirstShopForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default CreateFirstShopForm;
