import React, { useState } from "react";
import PropTypes from "prop-types";
import i18next from "i18next";
import CloseIcon from "mdi-material-ui/Close";
import Button from "@reactioncommerce/catalyst/Button";
import Select from "@reactioncommerce/catalyst/Select";
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
import updateGroupsForAccountsMutation from "../graphql/mutations/updateGroupsForAccounts";

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

/**
 * GroupSelector component
 * @param {Object} props Component props
 * @returns {React.Component} A React component
 */
function GroupSelector({ isOpen, onClose, onSuccess, accounts, groups }) {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [updateGroupsForAccounts] = useMutation(updateGroupsForAccountsMutation, {
    ignoreResults: true,
    onCompleted() {
      setIsSubmitting(false);
      onSuccess();
    },
    onError() {
      setIsSubmitting(false);
      enqueueSnackbar(i18next.t("admin.accountsTable.groupSelectorDialog.saveFailed"), { variant: "error" });
    }
  });

  // eslint-disable-next-line consistent-return
  const handleSubmit = async () => {
    const groupIds = selectedGroups && selectedGroups.map(({ value }) => (value));

    // Prevent user from executing action if they haven't yet selected at least one group
    if (!groupIds.length) {
      return enqueueSnackbar(i18next.t("admin.accountsTable.groupSelectorDialog.invalidSelection"), { variant: "warning" });
    }

    setIsSubmitting(true);

    await updateGroupsForAccounts({
      variables: {
        input: {
          groupIds,
          accountIds: accounts.map((account) => account._id)
        }
      }
    });

    setIsSubmitting(false);
    onClose();
    setSelectedGroups([]);
  };

  const groupsForSelect = groups.map((group) => ({ value: group._id, label: group.name }));

  const editingSingleAccount = Array.isArray(accounts) && accounts.length === 1;
  const accountHasGroups = accounts[0] && accounts[0].groups && Array.isArray(accounts[0].groups.nodes) && accounts[0].groups.nodes.length > 0;
  const noGroupsSelected = selectedGroups && selectedGroups.length === 0;

  // If modifying one single account, pre-select groups that the account already belongs to
  if (editingSingleAccount && accountHasGroups && noGroupsSelected) {
    const preSelectedGroups = accounts[0].groups.nodes.map((group) => ({ value: group._id, label: group.name }));
    setSelectedGroups(preSelectedGroups);
  }

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
        title={i18next.t("admin.accountsTable.bulkActions.addRemoveGroupsFromAccount")}
      />
      <CardContent>
        <Grid container spacing={1} className={classes.cardContainer}>
          <Grid item sm={12}>
            <Select
              isMulti
              options={groupsForSelect}
              onSelection={(tags) => setSelectedGroups(tags)}
              placeholder={i18next.t("admin.accountsTable.groupSelectorDialog.inputPlaceholder")}
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
          disabled={isSubmitting}
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

GroupSelector.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.object).isRequired,
  groups: PropTypes.arrayOf(PropTypes.object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default GroupSelector;
