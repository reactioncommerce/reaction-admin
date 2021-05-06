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
  const { viewer, refetchViewer } = useAuth();
  const [isAppLoading] = useIsAppLoading();

  if (isAppLoading) return <Components.Loading />;

  return (
    <Dashboard viewer={viewer} refetchViewer={refetchViewer} />
  );
}

export default App;
