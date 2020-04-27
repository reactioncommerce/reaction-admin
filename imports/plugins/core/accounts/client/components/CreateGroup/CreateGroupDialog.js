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
import useRoles from "../../hooks/useRoles";
import createGroupMutation from "../../graphql/mutations/createGroup";

const useStyles = makeStyles((theme) => ({
  cardRoot: {
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
  groupName: {
    type: String
  },
});
const validator = formSchema.getFormValidator();

/**
 * CreateGroup component
 * @param {Object} props Component props
 * @returns {React.Component} A React component
 */
function CreateGroup({ isOpen, onClose, onSuccess, shopId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const { roles } = useRoles(shopId);

  const [createGroup] = useMutation(createGroupMutation, {
    ignoreResults: true,
    onCompleted() {
      setIsSubmitting(false);
      onSuccess();
    },
    onError() {
      setIsSubmitting(false);
      enqueueSnackbar(i18next.t("admin.groupCards.createGroupDialog.saveFailed"), { variant: "warning" });
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

      await createGroup({
        variables: {
          input: {
            group: {
              name: formData.groupName,
              permissions: selectedRoles.map((role) => role.value)
            },
            shopId
          }
        }
      });

      setIsSubmitting(false);
    },
    validator(formData) {
      return validator(formSchema.clean(formData));
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    submitForm();
  };

  const rolesForSelect = roles.map((role) => ({ value: role.name, label: role.name }));

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      classes={{ root: classes.cardRoot }}
      fullWidth
      maxWidth="sm"
    >
      <CardHeader
        action={
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
        title={i18next.t("admin.groupCards.createGroupDialog.title")}
      />
      <CardContent>
        <Grid container spacing={1} className={classes.cardContainer}>
          <Grid item sm={12}>
            <TextField
              error={hasErrors(["groupName"])}
              fullWidth
              helperText={getFirstErrorMessage(["groupName"])}
              label={i18next.t("admin.groupCards.createGroupDialog.groupName")}
              {...getInputProps("groupName", muiOptions)}
            />
          </Grid>
          <Grid item sm={12}>
            <Select
              isMulti
              options={rolesForSelect}
              onSelection={(roles) => setSelectedRoles(roles)}
              placeholder={i18next.t("admin.groupCards.createGroupDialog.selectRoles")}
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
          {isSubmitting ? i18next.t("app.settings.saveProcessing") : i18next.t("app.saveChanges")}
        </Button>
      </CardActions>
    </Dialog>
  );
}

CreateGroup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  shopId: PropTypes.string
};

export default CreateGroup;
