import React from "react";
import Helmet from "react-helmet";
import { Route, Switch } from "react-router-dom";
import i18next from "i18next";
import useAuth from "../hooks/useAuth";
import Dashboard from "./Dashboard";
import { routes } from "/imports/client/ui";
import ContentViewFullLayout from "./ContentViewFullLayout";
import ContentViewStandardLayout from "./ContentViewStandardLayout";
import DefaultPage from "./DefaultPage";

/**
 * App component
 * @returns {React.ReactElement} React component
 */
function App() {
  const { isAdmin, isLoggedIn, redirectUrl } = useAuth();

  if (redirectUrl) {
    window.location.href = redirectUrl;
    return null;
  }

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
