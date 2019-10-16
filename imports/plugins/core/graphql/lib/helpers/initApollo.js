import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import { getOperationAST } from "graphql";
import ReactionError from "@reactioncommerce/reaction-error";
import { graphQlApiUrl, graphQlWebSocketUrl } from "/config";

// Validate API url variable
const isApiUrlAString = typeof graphQlApiUrl === "string";

if (!isApiUrlAString || (isApiUrlAString && graphQlApiUrl.length === 0)) {
  throw new ReactionError("not-defined", "\"graphQlApiUrl\" is not defined or has an empty value in `config.js`. See `config.example.js` more information.");
}

export const meteorAccountsLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("Meteor.loginToken");

  operation.setContext(() => ({
    headers: {
      "meteor-login-token": token
    }
  }));

  return forward(operation);
});

const httpLink = new HttpLink({ uri: graphQlApiUrl });

const standardLink = ApolloLink.from([
  meteorAccountsLink,
  httpLink
]);

let linkWithSubscriptions;

if (graphQlWebSocketUrl) {
  linkWithSubscriptions = ApolloLink.split(
    (operation) => {
      const operationAST = getOperationAST(operation.query, operation.operationName);
      return !!operationAST && operationAST.operation === "subscription";
    },
    new WebSocketLink({
      uri: graphQlWebSocketUrl,
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
  return new ApolloClient({
    link: linkWithSubscriptions || standardLink,
    cache: new InMemoryCache()
  });
}
