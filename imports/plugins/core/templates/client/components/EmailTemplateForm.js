import React, { useState } from "react";
import PropTypes from "prop-types";
import i18next from "i18next";
import { useMutation } from "@apollo/react-hooks";
import { useSnackbar } from "notistack";
import SimpleSchema from "simpl-schema";
import { Button, TextField } from "@reactioncommerce/catalyst";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles
} from "@material-ui/core";
import muiOptions from "reacto-form/cjs/muiOptions";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import updateEmailTemplateGQL from "../graphql/mutations/updateEmailTemplate";

const useStyles = makeStyles((theme) => ({
  deleteButton: {
    marginRight: "auto"
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 500
  },
  legend: {
    marginBottom: theme.spacing(1)
  }
}));

const emailTemplateSchema = new SimpleSchema({
  title: {
    type: String
  },
  subject: {
    type: String
  },
  language: {
    type: String,
    defaultValue: "en"
  },
  template: {
    type: String
  }
});
const validator = emailTemplateSchema.getFormValidator();

/**
 * @summary React component that renders the form for updating an e-mail template record.
 * @param {Object} props React props
 * @return {React.Node} React node
 */
export default function EmailTemplateForm(props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { emailTemplate, isOpen, onCloseDialog, refetch, shopId } = props;

  const onSuccess = () => {
    setIsSubmitting(false);
    refetch();
    onCloseDialog();
  };

  const onFailure = () => {
    setIsSubmitting(false);
    onCloseDialog();
    enqueueSnackbar(i18next.t("admin.emailTemplate.failure"), { variant: "warning" });
  };

  const [updateEmailTemplate] = useMutation(updateEmailTemplateGQL, {
    ignoreResults: true,
    onCompleted() {
      onSuccess();
      enqueueSnackbar(i18next.t("admin.emailTemplate.updateSuccess"), { variant: "success" });
    },
    onError() {
      onFailure();
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

      if (emailTemplate) {
        const emailTemplateInput = emailTemplateSchema.clean(formData);

        await updateEmailTemplate({
          variables: {
            input: {
              id: emailTemplate._id,
              subject: emailTemplateInput.subject,
              title: emailTemplateInput.title,
              template: emailTemplateInput.template,
              shopId
            }
          }
        });
      }
    },
    validator(formData) {
      return validator(emailTemplateSchema.clean(formData));
    },
    value: emailTemplate,
    logErrorsOnSubmit: true
  });

  const classes = useStyles();

  return (
    <div>
      <Dialog open={isOpen} onClose={onCloseDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <span className={classes.dialogTitle}>
            {i18next.t("templateUpdateForm.emailTemplates.updateEmailTemplate")}
          </span>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                error={hasErrors(["title"])}
                fullWidth
                helperText={getFirstErrorMessage(["title"])}
                label={i18next.t("templateGrid.columns.title")}
                placeholder={i18next.t("templateUpdateForm.emailTemplates.placeholder.title")}
                {...getInputProps("title", muiOptions)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={hasErrors(["subject"])}
                fullWidth
                helperText={getFirstErrorMessage(["subject"])}
                label={i18next.t("templateGrid.columns.subject")}
                placeholder={i18next.t("templateUpdateForm.emailTemplates.placeholder.subject")}
                {...getInputProps("subject", muiOptions)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={hasErrors(["language"])}
                fullWidth
                helperText={getFirstErrorMessage(["language"])}
                label={i18next.t("templateGrid.columns.language")}
                placeholder={i18next.t("templateUpdateForm.emailTemplates.placeholder.language")}
                {...getInputProps("language", muiOptions)}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={hasErrors(["template"])}
                fullWidth
                helperText={getFirstErrorMessage(["template"])}
                label={i18next.t("templateGrid.columns.template")}
                placeholder={i18next.t("templateUpdateForm.emailTemplates.placeholder.template")}
                multiline
                {...getInputProps("template", muiOptions)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
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

EmailTemplateForm.propTypes = {
  /**
   * An e-mail template code record
   */
  emailTemplate: PropTypes.object,
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
  refetch: PropTypes.func,
  /**
   * Shop ID to create/edit tax rate for
   */
  shopId: PropTypes.string
};
