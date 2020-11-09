import React, { useState } from "react";
import PropTypes from "prop-types";
import i18next from "i18next";
import SimpleSchema from "simpl-schema";
import CloseIcon from "mdi-material-ui/Close";
import Button from "@reactioncommerce/catalyst/Button";
import TextField from "@reactioncommerce/catalyst/TextField";
import Select from "@reactioncommerce/catalyst/Select";
import useReactoForm from "reacto-form/cjs/useReactoForm";
import muiOptions from "reacto-form/cjs/muiOptions";
import { useMutation } from "@apollo/react-hooks";
import { useSnackbar } from "notistack";
import {
  Box,
  Grid,
  CardActions,
  CardHeader,
  CardContent,
  Dialog,
  IconButton,
  makeStyles
} from "@material-ui/core";
import useRoles from "../hooks/useRoles";
import createGroupMutation from "../graphql/mutations/createGroup";
import updateGroupMutation from "../graphql/mutations/updateGroup";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    overflow: "visible",
    padding: theme.spacing(2)
  },
  cardContainer: {
    alignItems: "center"
  },
  cardActions: {
    padding: theme.spacing(2),
    justifyContent: "flex-end"
  },
  hidden: {
    display: "none"
  },
  visible: {
    display: "block"
  }
}));

const formSchema = new SimpleSchema({
  name: {
    type: String
  }
});
const validator = formSchema.getFormValidator();

/**
 * CreateOrEditGroup component
 * @param {Object} props Component props
 * @returns {React.Component} A React component
 */
function CreateOrEditGroup({ isOpen, onClose, onSuccess, group, shopId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const { roles } = useRoles(shopId);

  const [selectedRoles, setSelectedRoles] = useState(group ? group.permissions.map((role) => ({ label: role, value: role })) : []);

  let mutation = createGroupMutation;

  if (group) {
    mutation = updateGroupMutation;
  }

  const [createOrUpdateGroup] = useMutation(mutation, {
    ignoreResults: true,
    onCompleted() {
      setIsSubmitting(false);
      onSuccess();
      onClose();
    },
    onError() {
      setIsSubmitting(false);
      enqueueSnackbar(i18next.t("admin.groupCards.createOrUpdateGroupDialog.saveFailed"), { variant: "error" });
    }
  });

  const initialValues = {};
  const groupIdVariable = {};

  if (group) {
    initialValues.value = group;
    groupIdVariable.groupId = group._id;
  }

  const {
    getFirstErrorMessage,
    getInputProps,
    hasErrors,
    isDirty,
    submitForm
  } = useReactoForm({
    async onSubmit(formData) {
      setIsSubmitting(true);

      await createOrUpdateGroup({
        variables: {
          input: {
            group: {
              name: formData.name,
              description: formData.description,
              slug: formData.slug,
              permissions: selectedRoles.map((role) => role.value)
            },
            shopId,
            ...groupIdVariable
          }
        }
      });

      setIsSubmitting(false);
    },
    validator(formData) {
      return validator(formSchema.clean(formData));
    },
    ...initialValues
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    submitForm();
  };

  const rolesForSelect = roles.map((role) => ({ value: role.name, label: role.name }));

  return (
    <Dialog
      classes={{ paper: classes.dialogPaper }}
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <CardHeader
        action={
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
        title={i18next.t("admin.groupCards.createOrUpdateGroupDialog.title")}
      />
      <CardContent>
        <Grid container spacing={1} className={classes.cardContainer}>
          <Grid item sm={12}>
            <TextField
              error={hasErrors(["name"])}
              fullWidth
              helperText={getFirstErrorMessage(["name"])}
              label={i18next.t("admin.groupCards.createOrUpdateGroupDialog.name")}
              {...getInputProps("name", muiOptions)}
            />
          </Grid>
          <Grid item sm={12}>
            <TextField
              error={hasErrors(["slug"])}
              fullWidth
              helperText={getFirstErrorMessage(["slug"])}
              label={i18next.t("admin.groupCards.createOrUpdateGroupDialog.slug")}
              {...getInputProps("slug", muiOptions)}
            />
          </Grid>
          <Grid item sm={12}>
            <TextField
              error={hasErrors(["description"])}
              fullWidth
              helperText={getFirstErrorMessage(["description"])}
              label={i18next.t("admin.groupCards.createOrUpdateGroupDialog.description")}
              {...getInputProps("description", muiOptions)}
            />
          </Grid>
          <Grid item sm={12}>
            <Select
              fullWidth
              isMulti
              options={rolesForSelect}
              onSelection={setSelectedRoles}
              placeholder={i18next.t("admin.groupCards.createOrUpdateGroupDialog.selectRoles")}
              value={selectedRoles}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Box>
          <Button
            onClick={onClose}
          >
            {i18next.t("app.cancel")}
          </Button>
        </Box>
        <Button
          color="primary"
          disabled={isSubmitting || !isDirty}
          variant="contained"
          onClick={handleSubmit}
          type="submit"
        >
          {isSubmitting ? i18next.t("admin.settings.saveProcessing") : i18next.t("app.saveChanges")}
        </Button>
      </CardActions>
    </Dialog>
  );
}

CreateOrEditGroup.propTypes = {
  group: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  shopId: PropTypes.string
};

export default CreateOrEditGroup;
