import { useEffect } from "react";
import gql from "graphql-tag";
import { useHistory } from "react-router-dom";
import { useLazyQuery } from "@apollo/react-hooks";
import { useReactOidc } from "@axa-fr/react-oidc-context";
import { Meteor } from "meteor/meteor";
import { setAccessToken } from "/imports/plugins/core/graphql/lib/helpers/initApollo";
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

let lastLocationChangeUrl = null;

window.addEventListener("popstate", () => {
  lastLocationChangeUrl = document.location.pathname + document.location.search + document.location.hash;
});

/**
 * Hook to get user permissions for the App component
 * @return {Object} Permissions
 */
export default function useAuth() {
  const history = useHistory();

  // This is admittedly not ideal, but the `@axa-fr/react-oidc-context` pkg uses `window.history.pushState`
  // directly when we finish the OIDC login flow, and for whatever reason React Router DOM does not pick it
  // up. This workaround seems to work reliably: we call React Router's `history.push` with the same URL
  // we are already on, and it forces a reload.
  if (history && lastLocationChangeUrl) {
    history.push(lastLocationChangeUrl);
    lastLocationChangeUrl = null;
  }

  const { logout: oidcLogout, oidcUser } = useReactOidc();

  const { access_token: accessToken } = oidcUser || {};
  setAccessToken(accessToken);

  const [getViewer, {
    data: viewerData
  }] = useLazyQuery(
    viewerQuery,
    {
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
      onError(error) {
        // Can't find any more reliable way to check the status code from within this hook
        if (typeof error.message === "string" && error.message.includes("Received status code 401")) {
          // Token is expired or user was deleted from database
          oidcLogout();
        } else {
          Logger.error(error);
        }
      }
    }
  );

  // Perform a `viewer` query whenever we get a new access token
  useEffect(() => {
    if (accessToken) getViewer();
  }, [accessToken, getViewer]);

  const logout = () => {
    Meteor.logout(() => {
      // This involves redirect, so the page will full refresh at this point
      oidcLogout();
    });
  };

  return {
    logout,
    viewer: viewerData ? viewerData.viewer : null
  };
}
