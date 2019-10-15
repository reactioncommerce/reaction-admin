import React from "react";
import PropTypes from "prop-types";
import SimpleSchema from "simpl-schema";
import Button from "@reactioncommerce/catalyst/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/styles";
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

  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    submitForm
  } = useReactoForm({
    onSubmit,
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
      <Button color="primary" variant="contained" fullWidth onClick={submitForm}>Submit</Button>
    </div>
  );
}

CreateFirstShopForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default CreateFirstShopForm;
