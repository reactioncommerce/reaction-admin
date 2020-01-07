import React from "react";
import { Components } from "@reactioncommerce/reaction-components";
import useAuth from "../hooks/useAuth";
import Dashboard from "./Dashboard";
import useIsAppLoading from "/imports/client/ui/hooks/useIsAppLoading.js";

/**
 * App component
 * @returns {React.ReactElement} React component
 */
function App() {
  const { isLoading, isLoggedInToMeteor, logout, viewer } = useAuth();
  const [isAppLoading] = useIsAppLoading();

  if (isLoading || isAppLoading) return <Components.Loading />;

  return isLoggedInToMeteor ? <Dashboard logout={logout} viewer={viewer} /> : null;
}

export default App;
