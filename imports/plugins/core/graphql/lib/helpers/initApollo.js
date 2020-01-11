import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import { getOperationAST } from "graphql";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";

const { graphQlApiUrlHttp, graphQlApiUrlWebSocket } = Meteor.settings.public;

let sharedClient;
let token;

/**
 * @summary Set the access token that GraphQL requests will use in the Authorization header
 * @param {String} value New token value
 * @return {undefined}
 */
export function setAccessToken(value) {
  const previousToken = token;
  token = value;

  // "Resets your entire store by clearing out your cache and then re-executing all of your active queries.
  // This makes it so that you may guarantee that there is no data left in your store from a time
  // before you called this method."
  //
  // We do this because we have effectively switched users here. We don't want data from the previous user
  // (or the previous non-authenticated queries) to be kept.
  if (previousToken !== token) {
    if (sharedClient) sharedClient.resetStore();

    // If we are logged in with OAuth, log in as the same use with Meteor for the DDP connection
    Accounts.callLoginMethod({
      methodArguments: [{
        accessToken: token
      }]
    });
  }
}

/**
 * @summary Sets the Authorization header for all GraphQL requests done
 *   through simpleClient.
 * @param {Object} client graphql.js client instance
 * @returns {undefined}
 */
export function setSimpleClientTokenHeader(client) {
  if (token) {
    client.headers({ Authorization: token });
  } else {
    client.headers({});
  }
}

const authenticationLink = new ApolloLink((operation, forward) => {
  if (typeof token === "string") {
    operation.setContext(() => ({
      headers: {
        Authorization: token
      }
    }));
  }

  return forward(operation);
});

const httpLink = new HttpLink({ uri: graphQlApiUrlHttp });

const standardLink = ApolloLink.from([
  authenticationLink,
  httpLink
]);

let linkWithSubscriptions;

if (graphQlApiUrlWebSocket && graphQlApiUrlWebSocket.length) {
  linkWithSubscriptions = ApolloLink.split(
    (operation) => {
      const operationAST = getOperationAST(operation.query, operation.operationName);
      return !!operationAST && operationAST.operation === "subscription";
    },
    new WebSocketLink({
      uri: graphQlApiUrlWebSocket,
      options: {
        reconnect: true, // auto-reconnect
        connectionParams: {
          authToken: localStorage.getItem("Meteor.loginToken")
        }
      }
    }),
    standardLink
  );
}

/**
 * @name initApollo
 * @summary Initializes Apollo Client
 * @returns {Object} New ApolloClient
 */
export default function initApollo() {
  if (sharedClient) return sharedClient;

  sharedClient = new ApolloClient({
    link: linkWithSubscriptions || standardLink,
    cache: new InMemoryCache()
  });

  return sharedClient;
}
