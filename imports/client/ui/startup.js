import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { ThemeProvider } from "styled-components";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { ApolloProvider } from "react-apollo";
import { ComponentsProvider } from "@reactioncommerce/components-context";
import { TranslationProvider } from "/imports/plugins/core/ui/client/providers";
import initApollo from "/imports/plugins/core/graphql/lib/helpers/initApollo";
import { defaultTheme } from "@reactioncommerce/catalyst";
import { loadRegisteredBlocks, loadRegisteredComponents } from "@reactioncommerce/reaction-components";
import { SnackbarProvider } from "notistack";
import appComponents from "./appComponents";
import theme from "./theme";
import App from "./layouts/App";
import getRootNode from "./utils/getRootNode";
import RouterContext from "./context/RouterContext";
import snackbarPosition from "./utils/getSnackbarPosition";

Meteor.startup(() => {
  loadRegisteredBlocks();
  loadRegisteredComponents();

  const apolloClient = initApollo();

  Tracker.autorun((computation) => {
    const primaryShopSub = Meteor.subscribe("PrimaryShop");

    if (primaryShopSub.ready()) {
      ReactDOM.render(
        (
          <ApolloProvider client={apolloClient}>
            <BrowserRouter>
              <TranslationProvider>
                <ComponentsProvider value={appComponents}>
                  <ThemeProvider theme={theme}>
                    <MuiThemeProvider theme={defaultTheme}>
                      <SnackbarProvider anchorOrigin={snackbarPosition} maxSnack={3}>
                        <Route>
                          {(routeProps) => (
                            <RouterContext.Provider value={routeProps}>
                              <App />
                            </RouterContext.Provider>
                          )}
                        </Route>
                      </SnackbarProvider>
                    </MuiThemeProvider>
                  </ThemeProvider>
                </ComponentsProvider>
              </TranslationProvider>
            </BrowserRouter>
          </ApolloProvider>
        ),
        getRootNode()
      );

      computation.stop();
    }
  });
});
