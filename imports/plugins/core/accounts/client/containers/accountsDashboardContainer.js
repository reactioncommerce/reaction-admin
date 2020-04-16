import React from "react";
import { compose } from "recompose";
import Alert from "sweetalert2";
import { registerComponent, withIsAdmin } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import simpleGraphQLClient from "/imports/plugins/core/graphql/lib/helpers/simpleClient";
import withOpaqueShopId from "/imports/plugins/core/graphql/lib/hocs/withOpaqueShopId";
import { Accounts } from "/lib/collections";
import { i18next } from "/client/api";
import AccountsDashboard from "../components/accountsDashboard";
import addAccountToGroupMutation from "./addAccountToGroup.graphql";
import removeAccountFromGroupMutation from "./removeAccountFromGroup.graphql";
import withAccounts from "../hocs/withAccounts";
import withGroups from "../hocs/withGroups";
import useAuth from "../../../../../client/ui/hooks/useAuth";

const addAccountToGroupMutate = simpleGraphQLClient.createMutationFunction(addAccountToGroupMutation);
const removeAccountFromGroupMutate = simpleGraphQLClient.createMutationFunction(removeAccountFromGroupMutation);

/**
 * @summary Show confirmation alert to verify the user wants to remove the user from the group
 * @return {Object} Object with `value` prop that is truthy if they want to continue
 */
function alertConfirmRemoveUser() {
  return Alert({
    title: i18next.t("admin.settings.removeUser"),
    text: i18next.t("admin.settings.removeUserWarn"),
    type: "warning",
    showCancelButton: true,
    cancelButtonText: i18next.t("admin.settings.cancel"),
    confirmButtonText: i18next.t("admin.settings.continue")
  });
}

/**
 * @summary Show confirmation alert to verify the user wants to change the shop owner
 * @return {Object} Object with `value` prop that is truthy if they want to continue
 */
function alertConfirmChangeOwner() {
  return Alert({
    title: i18next.t("admin.settings.changeOwner"),
    text: i18next.t("admin.settings.changeShopOwnerWarn"),
    type: "warning",
    showCancelButton: true,
    cancelButtonText: i18next.t("admin.settings.cancel"),
    confirmButtonText: i18next.t("admin.settings.continue")
  });
}

function AccountsDashboardContainer(props) {
  const { viewer: loggedInAccount } = useAuth();

  const handleUserGroupChange = ({ account, currentGroupId, ownerGrpId, onMethodLoad, onMethodDone }) => {
    return async (event, groupId) => {
      if (onMethodLoad) onMethodLoad();

      // Confirm if removing owner role from myself
      if (currentGroupId === ownerGrpId) {
        if (loggedInAccount && loggedInAccount._id === account._id) {
          const { value } = await alertConfirmChangeOwner();
          if (!value) {
            if (onMethodDone) onMethodDone();
            return null;
          }
        }
      }

      try {
        await addAccountToGroupMutate({
          accountId: account._id,
          groupId
        });
      } catch (error) {
        Alerts.toast(i18next.t("admin.groups.addUserError", { err: error.message }), "error");
      }

      if (onMethodDone) onMethodDone();
      return null;
    };
  };

  const handleRemoveUserFromGroup = (account, groupId) => {
    return async () => {
      const { value } = await alertConfirmRemoveUser();
      if (!value) return null;

      try {
        await removeAccountFromGroupMutate({
          accountId: account._id,
          groupId
        });
      } catch (error) {
        Alerts.toast(i18next.t("admin.groups.removeUserError", { err: error.message }), "error");
      }

      return null;
    };
  };

  return (
    <AccountsDashboard
      {...props}
      handleUserGroupChange={handleUserGroupChange}
      handleRemoveUserFromGroup={handleRemoveUserFromGroup}
    />
  );
}

registerComponent("AccountsDashboard", AccountsDashboardContainer, [
  withIsAdmin,
  withOpaqueShopId,
  withGroups,
  withAccounts
]);

export default compose(
  withIsAdmin,
  withOpaqueShopId,
  withGroups,
  withAccounts
)(AccountsDashboardContainer);
