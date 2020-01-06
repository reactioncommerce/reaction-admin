import { useState, useEffect } from "react";
import gql from "graphql-tag";
import { useLazyQuery } from "@apollo/react-hooks";
import { useReactOidc } from "@axa-fr/react-oidc-context";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { setAccessToken } from "/imports/plugins/core/graphql/lib/helpers/initApollo";
import { Reaction } from "/client/api";
import Logger from "/client/modules/logger";

const viewerQuery = gql`
query getViewer {
  viewer {
    _id
    firstName
    language
    lastName
    name
    primaryEmailAddress
  }
}
`;

/**
 * Hook to get user permissions for the App component
 * @return {Object} Permissions
 */
export default function useAuth() {
  const [isAdmin, setAdmin] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { login, logout: oidcLogout, oidcUser } = useReactOidc();

  const { access_token: accessToken } = oidcUser || {};
  setAccessToken(accessToken);

  const [getViewer, {
    data: viewerData,
    loading: isLoadingViewer,
    networkStatus: viewerQueryNetworkStatus
  }] = useLazyQuery(
    viewerQuery,
    {
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
      onError(fetchError) {
        Logger.error(fetchError);
      }
    }
  );

  // Perform a `viewer` query whenever we get a new access token
  useEffect(() => {
    if (accessToken) getViewer();
  }, [accessToken, getViewer]);

  const logout = () => {
    setLoggingOut(true);
    Meteor.logout(() => {
      // This involves redirect, so the page will full refresh at this point
      oidcLogout();
    });
  };

  useEffect(() => {
    Tracker.autorun(() => {
      const hasDashboardAccessForAnyShop = Reaction.hasDashboardAccessForAnyShop();

      // Set is admin
      setAdmin(hasDashboardAccessForAnyShop);

      // Set whether the user is logged in or not. This with `!admin` can be used to determine if the
      // user is a customer
      setLoggedIn(!!Reaction.getUserId());

      // Attempt to check if we are still loading this data
      const isLoadingPermissions = (hasDashboardAccessForAnyShop !== true && hasDashboardAccessForAnyShop !== false);

      // When `viewerQueryNetworkStatus` is `4`, it is refetching because we logged in/out
      setLoading(isLoadingPermissions || isLoadingViewer || viewerQueryNetworkStatus === 4);

      // Sign out non-admins
      if (isLoggedIn && hasDashboardAccessForAnyShop === false) {
        logout();
      }
    });
  });

  if (!oidcUser && !isLoggingIn) {
    setLoggingIn(true);
    login();
  }

  if (accessToken && !isLoggedIn && !isLoggingOut) {
    // If we are logged in with OAuth, log in as the same use with Meteor for the DDP connection
    Accounts.callLoginMethod({
      methodArguments: [{
        accessToken
      }]
    });
  }

  return {
    accessToken,
    isAdmin,
    isLoading,
    isLoggedIn,
    logout,
    viewer: viewerData ? viewerData.viewer : null
  };
}
