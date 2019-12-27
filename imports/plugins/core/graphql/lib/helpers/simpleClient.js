import graphql from "graphql.js";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import createFlatRateFulfillmentMethod from "../mutations/createFlatRateFulfillmentMethod.graphql";
import updateFlatRateFulfillmentMethod from "../mutations/updateFlatRateFulfillmentMethod.graphql";
import deleteFlatRateFulfillmentMethod from "../mutations/deleteFlatRateFulfillmentMethod.graphql";

const { graphQlApiUrlHttp } = Meteor.settings.public;

/**
 * In React components, you should use Apollo. This client is available for Blaze
 * components and other code, but ideally we will not need this forever.
 */

const client = graphql(graphQlApiUrlHttp, { asJSON: true });

/**
 * @summary Sets the meteor-login-token header for all GraphQL requests done
 *   through simpleClient.
 * @returns {undefined}
 * @private
 */
function setTokenHeader() {
  const token = Accounts._storedLoginToken();
  if (token) {
    client.headers({ "meteor-login-token": token });
  } else {
    client.headers({});
  }
}

export default {
  createMutationFunction(mutation) {
    const cachedMutationFunction = client.mutate(mutation);
    return (variables) => {
      setTokenHeader();
      return cachedMutationFunction(variables);
    };
  },
  createQueryFunction(query) {
    const cachedQueryFunction = client.query(query);
    return (variables) => {
      setTokenHeader();
      return cachedQueryFunction(variables);
    };
  },
  mutations: {
    createFlatRateFulfillmentMethod: (variables) => {
      setTokenHeader();
      return client.mutate(createFlatRateFulfillmentMethod)(variables);
    },
    deleteFlatRateFulfillmentMethod: (variables) => {
      setTokenHeader();
      return client.mutate(deleteFlatRateFulfillmentMethod)(variables);
    },
    updateFlatRateFulfillmentMethod: (variables) => {
      setTokenHeader();
      return client.mutate(updateFlatRateFulfillmentMethod)(variables);
    }
  }
};
