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
import inviteShopMemberMutation from "../graphql/mutations/inviteShopMember";

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
  },
  email: {
    type: String,
    min: 3
  }
});
const validator = formSchema.getFormValidator();

/**
 * InviteShopMember component
 * @param {Object} props Component props
 * @returns {React.Component} A React component
 */
function InviteShopMember({ isOpen, onClose, onSuccess, groups, shopId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [inviteShopMember] = useMutation(inviteShopMemberMutation, {
    ignoreResults: true,
    onCompleted() {
      setIsSubmitting(false);
      onSuccess();
    },
    onError() {
      setIsSubmitting(false);
      enqueueSnackbar(i18next.t("admin.groupCards.inviteStaffMemberDialog.saveFailed"), { variant: "error" });
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

      await inviteShopMember({
        variables: {
          input: {
            email: formData.email,
            groupIds: selectedGroups.map((role) => role.value),
            name: formData.name,
            shopId,
            shouldGetAdminUIAccess: true
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

  const groupsForSelect = groups.map((group) => ({ value: group._id, label: group.name }));

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
        title={i18next.t("admin.groupCards.inviteStaffMemberDialog.title")}
      />
      <CardContent>
        <Grid container spacing={1} className={classes.cardContainer}>
          <Grid item sm={12}>
            <TextField
              error={hasErrors(["name"])}
              fullWidth
              helperText={getFirstErrorMessage(["name"])}
              label={i18next.t("admin.groupCards.inviteStaffMemberDialog.name")}
              {...getInputProps("name", muiOptions)}
            />
          </Grid>
          <Grid item sm={12}>
            <TextField
              error={hasErrors(["email"])}
              fullWidth
              helperText={getFirstErrorMessage(["email"])}
              label={i18next.t("admin.groupCards.inviteStaffMemberDialog.email")}
              {...getInputProps("email", muiOptions)}
            />
          </Grid>
          <Grid item sm={12}>
            <Select
              isMulti
              options={groupsForSelect}
              onSelection={(groupsToSelect) => setSelectedGroups(groupsToSelect)}
              placeholder={i18next.t("admin.groupCards.inviteStaffMemberDialog.selectGroups")}
              value={selectedGroups}
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

InviteShopMember.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.object),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  shopId: PropTypes.string
};

export default InviteShopMember;
