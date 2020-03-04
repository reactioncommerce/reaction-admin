import React, { useState } from "react";
import { i18next } from "/client/api";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Box,
  makeStyles
} from "@material-ui/core";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import SimpleSchema from "simpl-schema";
import muiOptions from "reacto-form/cjs/muiOptions";
import TextField from "@reactioncommerce/catalyst/TextField";
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
  facebookMsg: {
    type: String,
    optional: true
  },
  twitterMsg: {
    type: String,
    optional: true
  },
  pinterestMsg: {
    type: String,
    optional: true
  }
});

const validator = formSchema.getFormValidator();

/**
 *
 * @param {*} props
 */
const ProductSocialForm = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    onUpdateProduct,
    product
  } = useProduct();

  let content;

  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    submitForm,
    isDirty
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);

      await onUpdateProduct({
        product: formSchema.clean(formData)
      });

      setIsSubmitting(false);
    },
    validator(formData) {
      return validator(formSchema.clean(formData));
    },
    value: product
  });

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
          error={hasErrors(["facebookMsg"])}
          fullWidth
          helperText={getFirstErrorMessage(["facebookMsg"])}
          label={i18next.t("productDetailEdit.facebookMsg")}
          {...getInputProps("facebookMsg", muiOptions)}
        />
        <TextField
          className={classes.textField}
          error={hasErrors(["twitterMsg"])}
          fullWidth
          helperText={getFirstErrorMessage(["twitterMsg"])}
          label={i18next.t("productDetailEdit.twitterMsg")}
          {...getInputProps("twitterMsg", muiOptions)}
        />
        <TextField
          className={classes.textField}
          error={hasErrors(["pinterestMsg"])}
          fullWidth
          helperText={getFirstErrorMessage(["pinterestMsg"])}
          label={i18next.t("productDetailEdit.pinterestMsg")}
          {...getInputProps("pinterestMsg", muiOptions)}
        />
        <Box textAlign="right">
          <Button
            color="primary"
            disabled={!isDirty || isSubmitting}
            variant="contained"
            type="submit"
          >
            {i18next.t("app.saveChanges")}
          </Button>
        </Box>
      </form>
    );
  }

  return (
    <Card className={classes.card} ref={ref}>
      <CardHeader title={i18next.t("social.socialTitle")} />
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
});

export default ProductSocialForm;
