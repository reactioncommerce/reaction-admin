import React, { Fragment, useState } from "react";
import classNames from "classnames";
import { useMutation, useQuery } from "@apollo/react-hooks";
import i18next from "i18next";
import Button from "@reactioncommerce/catalyst/Button";
import { useSnackbar } from "notistack";
import { Card, CardHeader, CardContent, Collapse, Grid, IconButton, makeStyles } from "@material-ui/core";
import ExpandMoreIcon from "mdi-material-ui/ChevronUp";
import { Components } from "@reactioncommerce/reaction-components";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import groupsQuery from "../graphql/queries/groups";
import archiveGroups from "../graphql/mutations/archiveGroups";
import updateGroup from "../graphql/mutations/updateGroup";
import cloneGroups from "../graphql/mutations/cloneGroups";
import createGroupMutation from "../graphql/mutations/createGroup";
import AccountsTable from "./AccountsTable";
import CreateGroupDialog from "./CreateGroup/CreateGroupDialog";
import useGroups from "../hooks/useGroups";

const useStyles = makeStyles(() => ({
  card: {
    overflow: "visible"
  }
}));

/**
 * @summary Main products view
 * @name ProductsTable
 * @returns {React.Component} A React component
 */
function GroupCards() {
  const { enqueueSnackbar } = useSnackbar();
  const [shopId] = useCurrentShopId();
  const [createGroup, { error: createGroupError }] = useMutation(createGroupMutation);
  const classes = useStyles();
  const [isCreateGroupDialogVisible, setCreateGroupDialogVisibility] = useState(false);
  const { isLoadingGroups, groups, refetchGroups } = useGroups(shopId);

  const handleShowCreateGroupModal = async () => {
    const { data } = await createGroup({ variables: { input: { shopId } } });

    if (data) {
      refetchGroups();
    }

    if (createGroupError) {
      enqueueSnackbar(i18next.t("admin.productTable.bulkActions.error", { variant: "error" }));
    }
  };

  return (
    <Fragment>
      <CreateGroupDialog
        isOpen={isCreateGroupDialogVisible}
        onSuccess={refetchGroups}
        onClose={() => setCreateGroupDialogVisibility(false)}
        shopId={shopId}
      />
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <Button color="primary" variant="contained" onClick={() => setCreateGroupDialogVisibility(true)}>
            {i18next.t("admin.createGroup") || "Create group"}
          </Button>
        </Grid>
        <Grid item sm={12}>
          {!shopId || !groups || isLoadingGroups ? <Components.Loading /> : groups.map((group) => (
            <Card className={classes.card} key={group._id}>
              <CardHeader classes={{ root: classes.cardHeader }} title={group.name} />
              <CardContent>
                <AccountsTable group={group} />
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default GroupCards;
