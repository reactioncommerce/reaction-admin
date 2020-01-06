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
  const { isLoading, isLoggedIn, logout, viewer } = useAuth();
  const [isAppLoading] = useIsAppLoading();

  if (isLoading || isAppLoading) return <Components.Loading />;

  return isLoggedIn ? <Dashboard logout={logout} viewer={viewer} /> : null;
}

export default App;
