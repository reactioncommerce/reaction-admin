import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import { getOperationAST } from "graphql";
import { Meteor } from "meteor/meteor";
import { accountsLink } from "@accounts/apollo-link";
import getAccountsHandler from "../../../../../../lib/accountsServer";

const { graphQlApiUrlHttp, graphQlApiUrlWebSocket } = Meteor.settings.public;

let sharedClient;
let token;

/**
 * @summary Set the access token that GraphQL requests will use in the Authorization header
 * @param {String} value New token value
 * @return {undefined}
 */
export function setAccessToken(value) {
  token = value;
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

const { accountsClient } = getAccountsHandler();
const authLink = accountsLink(() => accountsClient);

const httpLink = new HttpLink({ uri: graphQlApiUrlHttp });

const standardLink = ApolloLink.from([
  authLink,
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
          authToken: localStorage.getItem("accounts:accessToken")
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
