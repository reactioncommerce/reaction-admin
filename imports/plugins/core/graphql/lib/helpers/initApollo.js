import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import { getOperationAST } from "graphql";
import { graphQlApiUrl, graphQlWebSocketUrl } from "/config";

export const meteorAccountsLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("Meteor.loginToken");

  operation.setContext(() => ({
    headers: {
      "meteor-login-token": token
    }
  }));

  return forward(operation);
});

const link = ApolloLink.split(
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
  meteorAccountsLink.concat(new HttpLink({ uri: graphQlApiUrl }))
);

/**
 * @name initApollo
 * @summary Initializes Apollo Client
 * @returns {Object} New ApolloClient
 */
export default function initApollo() {
  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  });
}
