import { ApolloLink } from "apollo-link";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { Meteor } from "meteor/meteor";
import { AccountsClient } from "@accounts/client";
import { AccountsClientPassword } from "@accounts/client-password";
import { AccountsGraphQLClient } from "@accounts/graphql-client";

const { graphQlApiUrlHttp } = Meteor.settings.public;

const passwordClient = null;
let accountsClient = null;

/**
 * Return and caches a copy of passwordClient and accountsClient.
 *
 * @returns {Object} of form { AccountsClientPassword, AccountsClient }
 */
export default function getAccountsHandler() {
  if (passwordClient && accountsClient) {
    return { passwordClient, accountsClient };
  }
  const cache = new InMemoryCache();

  const httpLink = new HttpLink({ uri: graphQlApiUrlHttp });

  const throwAwayGraphQLClient = new ApolloClient({
    cache,
    link: ApolloLink.from([httpLink])
  });

  // Create your transport
  const accountsGraphQL = new AccountsGraphQLClient({
    graphQLClient: throwAwayGraphQLClient
  });

  // Create the AccountsClient
  accountsClient = new AccountsClient(
    {
      // accountsClient Options
    },
    accountsGraphQL
  );

  return { passwordClient: new AccountsClientPassword(accountsClient), accountsClient };
}
