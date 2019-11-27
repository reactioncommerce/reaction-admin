import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import { getOperationAST } from "graphql";
import { Meteor } from "meteor/meteor";

const { graphQlApiUrlHttp, graphQlApiUrlWebSocket } = Meteor.settings.public;

export const meteorAccountsLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("Meteor.loginToken");

  if (typeof token === "string") {
    operation.setContext(() => ({
      headers: {
        "meteor-login-token": token
      }
    }));
  }

  return forward(operation);
});

const httpLink = new HttpLink({ uri: graphQlApiUrlHttp });

const standardLink = ApolloLink.from([
  meteorAccountsLink,
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

let sharedClient;

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
