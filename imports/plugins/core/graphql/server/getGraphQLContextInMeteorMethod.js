import collections from "/imports/collections/rawCollections";

const baseContext = {};

/**
 * Calls buildContext to build a GraphQL context object, after first looking up
 * the user by userId in collections.users.
 *
 * Usage in a Meteor method:
 *
 * ```js
 * const context = Promise.await(getGraphQLContextInMeteorMethod(this.userId));
 * ```
 *
 * @method getGraphQLContextInMeteorMethod
 * @summary Call this in a Meteor method that wraps a GraphQL mutation, to get a context
 *   to pass to the mutation.
 * @param {String} userId - The user ID for the current request
 * @returns {Object} A GraphQL context object
 */
export default async function getGraphQLContextInMeteorMethod(userId) {
  let user;
  if (userId) {
    user = await collections.users.findOne({ _id: userId });
    if (!user) throw new Error(`No user found with ID ${userId}`);
  }

  return { ...baseContext };
}
