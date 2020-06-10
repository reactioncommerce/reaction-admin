import React, { Fragment, useState } from "react";
import i18next from "i18next";
import Button from "@reactioncommerce/catalyst/Button";
import { Grid, makeStyles } from "@material-ui/core";
import { Components } from "@reactioncommerce/reaction-components";
import useCurrentShopId from "/imports/client/ui/hooks/useCurrentShopId";
import useGroups from "../hooks/useGroups";
import CreateOrEditGroupDialog from "./CreateOrEditGroupDialog";
import InviteShopMemberDialog from "./InviteShopMemberDialog";
import GroupCard from "./GroupCard";

const useStyles = makeStyles(() => ({
  actionButtons: {
    marginTop: "1rem"
  },
  actionButton: {
    "marginLeft": ".5rem",
    "&:first-child": {
      marginLeft: 0
    }
  }
}));

/**
 * @summary Main groups view
 * @name GroupCards
 * @returns {React.Component} A React component
 */
function GroupCards() {
  const [shopId] = useCurrentShopId();
  const [isCreateGroupDialogVisible, setCreateGroupDialogVisibility] = useState(false);
  const [isInviteShopMemberDialogVisible, setInviteShopMemberDialogVisibility] = useState(false);
  const { isLoadingGroups, groups, refetchGroups } = useGroups(shopId);
  const classes = useStyles();

  return (
    <Fragment>
      <CreateOrEditGroupDialog
        isOpen={isCreateGroupDialogVisible}
        onSuccess={refetchGroups}
        onClose={() => setCreateGroupDialogVisibility(false)}
        shopId={shopId}
      />
      <InviteShopMemberDialog
        isOpen={isInviteShopMemberDialogVisible}
        onSuccess={() => true}
        onClose={() => setInviteShopMemberDialogVisibility(false)}
        groups={groups}
        shopId={shopId}
      />
      <Grid container spacing={3}>
        <Grid item sm={12} className={classes.actionButtons}>
          <Button className={classes.actionButton} color="primary" variant="contained" onClick={() => setCreateGroupDialogVisibility(true)}>
            {i18next.t("admin.accounts.createGroup") || "Create group"}
          </Button>
          <Button className={classes.actionButton} color="primary" variant="contained" onClick={() => setInviteShopMemberDialogVisibility(true)}>
            {i18next.t("admin.accounts.inviteStaffMember") || "Invite staff member"}
          </Button>
        </Grid>
        <Grid item sm={12}>
          {!shopId || !groups || isLoadingGroups ? <Components.Loading /> : groups.map((group) => (
            <GroupCard
              group={group}
              groups={groups}
              isLoadingGroups={isLoadingGroups}
              key={group._id}
              refetchGroups={refetchGroups}
              shopId={shopId}
            />
          ))}
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default GroupCards;
