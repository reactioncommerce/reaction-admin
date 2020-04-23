import { GET_PRIMARY_SHOP_ID, GET_GROUPS } from "./queries";

/**
 * @summary Queries for tags the match the provided user query
 * @param {Object} apolloClient The apolloClient
 * @param {String} query Query provided by the user
 * @returns {Array} An array of options formatted for use with react-select
 */
export async function getGroups(apolloClient, query) {
  const { data, error } = await apolloClient.query({
    query: GET_GROUPS,
    variables: {
      shopId: primaryShopId,
      filter: query
    }
  });

  let options = [];
  if (!error && data) {
    options = data.tags.edges.map(({ node }) => ({
      label: node.name,
      value: node._id
    }));
  }

  return options;
}
