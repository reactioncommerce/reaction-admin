import React from "react";
import { OidcSecure } from "@axa-fr/react-oidc-context";
import { Components } from "@reactioncommerce/reaction-components";
import useAuth from "../hooks/useAuth";
import Dashboard from "./Dashboard";
import useIsAppLoading from "/imports/client/ui/hooks/useIsAppLoading.js";

/**
 * App component
 * @returns {React.ReactElement} React component
 */
function App() {
  const { logout, viewer } = useAuth();
  const [isAppLoading] = useIsAppLoading();

  if (isAppLoading) return <Components.Loading />;

  return (
    <OidcSecure>
      <Dashboard logout={logout} viewer={viewer} />
    </OidcSecure>
  );
}

export default App;
