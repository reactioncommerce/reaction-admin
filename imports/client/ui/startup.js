import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import { AuthenticationProvider, oidcLog } from "@axa-fr/react-oidc-context";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { ThemeProvider } from "styled-components";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
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

const { oidcClientId, oidcUrl, rootUrl } = Meteor.settings.public;

const makeAbsolute = (relativeUrl) => {
  const url = new URL(relativeUrl, rootUrl); // eslint-disable-line node/no-unsupported-features/node-builtins
  return url.href;
};

// https://github.com/AxaGuilDEv/react-oidc/tree/master/packages/context#application-startup-indexjs
/* eslint-disable camelcase */
const oidcConfiguration = {
  client_id: oidcClientId,
  redirect_uri: makeAbsolute("/authentication/callback"),
  response_type: "code",
  post_logout_redirect_uri: rootUrl,
  scope: "openid",
  authority: oidcUrl,
  silent_redirect_uri: makeAbsolute("/authentication/silent_callback"),
  automaticSilentRenew: true,
  loadUserInfo: true,
  triggerAuthFlow: true
};
/* eslint-enable camelcase */

const oidcProps = {
  configuration: oidcConfiguration,
  // NONE, ERROR, WARN, INFO, DEBUG
  // Change to DEBUG temporarily if you're debugging an issue with login/logout/auth
  loggerLevel: oidcLog.NONE,
  // These are components for which the @axa-fr/react-oidc-context package shows
  // default text if we don't override these. We don't really need them since in
  // our situation they're only shown for a second.
  authenticating: () => null,
  callbackComponentOverride: () => null,
  notAuthenticated: () => null,
  notAuthorized: () => null,
  sessionLostComponent: () => null
};

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
              <AuthenticationProvider {...oidcProps}>
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
              </AuthenticationProvider>
            </BrowserRouter>
          </ApolloProvider>
        ),
        getRootNode()
      );

      computation.stop();
    }
  });
});
