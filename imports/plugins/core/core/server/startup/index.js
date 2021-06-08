import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import Logger from "@reactioncommerce/logger";
import Reaction from "../Reaction";
import config from "../config";
import "./browser-policy";
import RateLimiters from "./rate-limits";
import { ensureHydraClient, expandAuthToken } from "./oauth";

const {
  OAUTH2_CLIENT_ID,
  OAUTH2_IDP_PUBLIC_CHANGE_PASSWORD_URL,
  OAUTH2_PUBLIC_URL,
  PUBLIC_GRAPHQL_API_URL_HTTP,
  PUBLIC_GRAPHQL_API_URL_WS,
  PUBLIC_FILES_BASE_URL,
  PUBLIC_I18N_BASE_URL,
  PUBLIC_STOREFRONT_HOME_URL,
  REACTION_METEOR_APP_COMMAND_START_TIME,
  ROOT_URL
} = config;

/**
 * @summary Core startup function
 * @returns {undefined}
 */
export default function startup() {
  const startTime = Date.now();

  // This env may be set by the launch script, allowing us to time how long Meteor build/startup took.
  if (REACTION_METEOR_APP_COMMAND_START_TIME) {
    const elapsedMs = startTime - REACTION_METEOR_APP_COMMAND_START_TIME;
    Logger.info(`Meteor startup finished: ${elapsedMs}ms (This is incorrect if this is a restart.)`);
  }

  RateLimiters();

  // Ensure there is a client defined on the Hydra service with ID OAUTH2_CLIENT_ID and expected configuration
  Promise.await(ensureHydraClient());

  // Register a Meteor login handler that uses a Hydra access token to figure out which user it is
  // and then "log in" that user for Meteor DDP. This is how we tie the two login systems together
  // until we are fully migrated off Meteor.
  Accounts.registerLoginHandler("accessToken", (options) => {
    if (!options.accessToken) return undefined; // don't handle

    const tokenInfo = Promise.await(expandAuthToken(options.accessToken));
    if (!tokenInfo) throw new Meteor.Error(403, "Invalid access token");

    const { active, sub: userId } = tokenInfo;
    if (!active) throw new Meteor.Error(403, "Token expired");
    if (!userId) throw new Meteor.Error(403, "No user ID associated with token");

    return { userId }; // eslint-disable-line consistent-return
  });

  const endTime = Date.now();
  Logger.info(`Reaction initialization finished: ${endTime - startTime}ms`);

  // Take config provided by ENVs and make it available to clients through
  // Meteor's settings feature.
  // See https://docs.meteor.com/api/core.html#Meteor-settings
  Object.assign(Meteor.settings.public, {
    filesBaseUrl: PUBLIC_FILES_BASE_URL,
    graphQlApiUrlHttp: PUBLIC_GRAPHQL_API_URL_HTTP,
    graphQlApiUrlWebSocket: PUBLIC_GRAPHQL_API_URL_WS,
    i18nBaseUrl: PUBLIC_I18N_BASE_URL,
    oidcClientId: OAUTH2_CLIENT_ID,
    oidcUrl: OAUTH2_PUBLIC_URL,
    passwordChangeUrl: OAUTH2_IDP_PUBLIC_CHANGE_PASSWORD_URL,
    rootUrl: ROOT_URL,
    storefrontHomeUrl: PUBLIC_STOREFRONT_HOME_URL
  });

  // Main purpose of this right now is to wait to start Meteor app tests
  Reaction.emitAppStartupComplete();
}
