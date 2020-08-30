import { GET_TAGS } from "./queries";

/**
 * @summary Queries for tags the match the provided user query
 * @param {Object} apolloClient The apolloClient
 * @param {String} query Query provided by the user
 * @param {String} shopId Shop ID to fetch tags for
 * @returns {Array} An array of options formatted for use with react-select
 */
export async function getTags(apolloClient, query, shopId) {
  const { data, error } = await apolloClient.query({
    query: GET_TAGS,
    variables: {
      shopId,
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
