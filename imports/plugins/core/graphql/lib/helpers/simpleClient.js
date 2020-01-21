import graphql from "graphql.js";
import { Meteor } from "meteor/meteor";
import { setSimpleClientTokenHeader } from "/imports/plugins/core/graphql/lib/helpers/initApollo";
import createFlatRateFulfillmentMethod from "../mutations/createFlatRateFulfillmentMethod.graphql";
import updateFlatRateFulfillmentMethod from "../mutations/updateFlatRateFulfillmentMethod.graphql";
import deleteFlatRateFulfillmentMethod from "../mutations/deleteFlatRateFulfillmentMethod.graphql";

const { graphQlApiUrlHttp } = Meteor.settings.public;

/**
 * In React components, you should use Apollo. This client is available for Blaze
 * components and other code, but ideally we will not need this forever.
 */

const client = graphql(graphQlApiUrlHttp, { asJSON: true });

export default {
  createMutationFunction(mutation) {
    const cachedMutationFunction = client.mutate(mutation);
    return (variables) => {
      setSimpleClientTokenHeader(client);
      return cachedMutationFunction(variables);
    };
  },
  createQueryFunction(query) {
    const cachedQueryFunction = client.query(query);
    return (variables) => {
      setSimpleClientTokenHeader(client);
      return cachedQueryFunction(variables);
    };
  },
  mutations: {
    createFlatRateFulfillmentMethod: (variables) => {
      setSimpleClientTokenHeader(client);
      return client.mutate(createFlatRateFulfillmentMethod)(variables);
    },
    deleteFlatRateFulfillmentMethod: (variables) => {
      setSimpleClientTokenHeader(client);
      return client.mutate(deleteFlatRateFulfillmentMethod)(variables);
    },
    updateFlatRateFulfillmentMethod: (variables) => {
      setSimpleClientTokenHeader(client);
      return client.mutate(updateFlatRateFulfillmentMethod)(variables);
    }
  }
};
