/**
 * Public config
 * Copy this file to `config.js`
 * **DO NOT PUT SECRETS IN THIS FILE**
 */

/**
 * i18next translation resource url
 */
export const i18nResourceUrl = "http://localhost:3000/locales/resources.json?lng={{lng}}&ns={{ns}}";

/**
 * i18next translation namespace url
 */
export const i18nNamespaceUrl = "http://localhost:3000/namespaces.json";

/**
 * Reaction API url
 */
export const graphQlApiUrl = "http://localhost:3000/graphql-beta";

/**
 * Reaction API websocket url for GraphQL subscriptions
 */
export const graphQlWebSocketUrl = "ws://localhost:3000/graphql-beta";
