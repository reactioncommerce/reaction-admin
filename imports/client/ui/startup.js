import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";
import { Meteor } from "meteor/meteor";
import { ThemeProvider } from "styled-components";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { ApolloProvider } from "react-apollo";
import i18next from "i18next";
import { ComponentsProvider } from "@reactioncommerce/components-context";
import { TranslationProvider } from "/imports/plugins/core/ui/client/providers";
import initApollo from "/imports/plugins/core/graphql/lib/helpers/initApollo";
import { defaultTheme } from "@reactioncommerce/catalyst";
import { loadRegisteredBlocks, loadRegisteredComponents } from "@reactioncommerce/reaction-components";
import appComponents from "./appComponents";
import theme from "./theme";
import App from "./layouts/App";
import getRootNode from "./utils/getRootNode";
import RouterContext from "./context/RouterContext";

Meteor.startup(() => {
  loadRegisteredBlocks();
  loadRegisteredComponents();

  // const primaryShopSub = Meteor.subscribe("PrimaryShop");
  // const packageSub = Meteor.subscribe("Packages");

  const apolloClient = initApollo();

  ReactDOM.render(
    (
      <ApolloProvider client={apolloClient}>
        <BrowserRouter>
          <TranslationProvider>
            <ComponentsProvider value={appComponents}>
              <ThemeProvider theme={theme}>
                <MuiThemeProvider theme={defaultTheme}>
                  <Route>
                    {(routeProps) => (
                      <RouterContext.Provider value={routeProps}>
                        <App />
                      </RouterContext.Provider>
                    )}
                  </Route>
                </MuiThemeProvider>
              </ThemeProvider>
            </ComponentsProvider>
          </TranslationProvider>
        </BrowserRouter>
      </ApolloProvider>
    ),
    getRootNode()
  );
});
