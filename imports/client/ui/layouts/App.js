import React from "react";
import Helmet from "react-helmet";
import { Route, Switch } from "react-router-dom";
import i18next from "i18next";
import { Components } from "@reactioncommerce/reaction-components";
import useAuth from "../hooks/useAuth";
import Dashboard from "./Dashboard";
import { routes } from "/imports/client/ui";
import useIsAppLoading from "/imports/client/ui/hooks/useIsAppLoading.js";
import ContentViewFullLayout from "./ContentViewFullLayout";
import ContentViewStandardLayout from "./ContentViewStandardLayout";
import DefaultPage from "./DefaultPage";

/**
 * App component
 * @returns {React.ReactElement} React component
 */
function App() {
  const { isAdmin, isLoading, isLoggedIn, redirectUrl } = useAuth();
  const [isAppLoading] = useIsAppLoading();

  if (redirectUrl) {
    window.location.href = redirectUrl;
    return null;
  }

  if (isLoading || isAppLoading) return <Components.Loading />;

  if (isLoggedIn) {
    return isAdmin ? <Dashboard /> : <DefaultPage />;
  }

  return (
    <>
      <Switch>
        {
          routes.map((route, index) => (
            <Route
              key={route.path || `app-route-${index}`}
              path={route.path}
              exact={route.exact}
              render={(props) => {
                const title = i18next.t(route.sidebarI18nLabel, { defaultValue: "Reaction Admin" });
                // If the layout component is explicitly null
                if (route.layoutComponent === null) {
                  return (
                    <ContentViewFullLayout>
                      <Helmet title={title} />
                      <route.mainComponent uiState={this.state} {...props} />
                    </ContentViewFullLayout>
                  );
                }

                const LayoutComponent = route.layoutComponent || ContentViewStandardLayout;

                return (
                  <LayoutComponent>
                    <Helmet title={title} />
                    <route.mainComponent uiState={this.state} {...props} />
                  </LayoutComponent>
                );
              }}
            />
          ))
        }
        <Route
          key="default"
          component={DefaultPage}
        />
      </Switch>
    </>
  );
}

export default App;
