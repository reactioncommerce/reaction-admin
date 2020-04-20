import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import i18next from "i18next";
import Button from "@reactioncommerce/catalyst/Button";
import { useSnackbar } from "notistack";
import { Card, CardHeader, CardContent, Grid, makeStyles } from "@material-ui/core";
import { Components } from "@reactioncommerce/reaction-components";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import groupsQuery from "../graphql/queries/groups";
import archiveGroups from "../graphql/mutations/archiveGroups";
import updateGroup from "../graphql/mutations/updateGroup";
import cloneGroups from "../graphql/mutations/cloneGroups";
import createGroupMutation from "../graphql/mutations/createGroup";
import AccountsTable from "./AccountsTable";

const useStyles = makeStyles((theme) => ({
  card: {
    overflow: "visible"
  },
  cardHeader: {
    paddingBottom: 0
  },
  selectedProducts: {
    fontWeight: 400,
    marginLeft: theme.spacing(1)
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

  const { data: groupData, loading, refetch: refetchGroups } = useQuery(groupsQuery, {
    variables: {
      shopId
    },
    fetchPolicy: "network-only"
  });

  let groups;

  if (groupData && groupData.groups && groupData.groups.nodes) {
    groups = groupData.groups.nodes;
  }

  const handleCreateGroup = async () => {
    const { data } = await createGroup({ variables: { input: { shopId } } });

    if (data) {
      refetchGroups();
    }

    if (createGroupError) {
      enqueueSnackbar(i18next.t("admin.productTable.bulkActions.error", { variant: "error" }));
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item sm={12}>
        <Button color="primary" variant="contained" onClick={handleCreateGroup}>
          {i18next.t("admin.createGroup") || "Create group"}
        </Button>
      </Grid>
      <Grid item sm={12}>
        {!shopId || !groups || loading ? <Components.Loading /> : groups.map((group) => (
          <Card className={classes.card} key={group._id}>
            <CardHeader classes={{ root: classes.cardHeader }} title={group.name} />
            <CardContent>
              <AccountsTable group={group} />
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
}

export default GroupCards;
