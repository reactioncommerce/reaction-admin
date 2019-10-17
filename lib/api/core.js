import { Meteor } from "meteor/meteor";

let Reaction;

// TODO: Decide how we want to approach this problem - duplicate content on both client
// and server, or detecting client/server and DRYing up the code.
if (Meteor.isServer) {
  Reaction = require("/imports/plugins/core/core/server/Reaction").default;
} else {
  ({ Reaction } = require("/client/api"));
}

/**
  * @summary gets shopIds of shops where user has provided permissions
  * @param {Array} roles - roles to check if user has
  * @param {Object} userId - userId to check permissions for (defaults to current user)
  * @returns {Array} - shopIds user has provided permissions for
  * @private
  */
function getShopsForUser(roles, userId = Reaction.getUserId()) {
  // Get full user object, and get shopIds of all shops they are attached to
  const user = Meteor.user(userId);
  if (!user || !user.roles) {
    return [];
  }
  const shopIds = Object.keys(user.roles);
  // Remove "__global_roles__" from the list of shopIds, as this function will always return true for
  // marketplace admins if that "id" is left in the check
  const filteredShopIds = shopIds.filter((shopId) => shopId !== "__global_roles__");

  // Reduce shopIds to shopsWithPermission, using the roles passed in to this function
  const shopIdsWithRoles = filteredShopIds.reduce((shopsWithPermission, shopId) => {
    // Get list of roles user has for this shop
    const rolesUserHas = user.roles[shopId];

    // Find first role that is included in the passed in roles array, otherwise hasRole is undefined
    const hasRole = rolesUserHas.find((roleUserHas) => roles.includes(roleUserHas));

    // if we found the role, then the user has permission for this shop. Add shopId to shopsWithPermission array
    if (hasRole) {
      shopsWithPermission.push(shopId);
    }
    return shopsWithPermission;
  }, []);

  return shopIdsWithRoles;
}

const NewReaction = Object.assign(Reaction, {
  getShopsForUser
});

export { NewReaction as Reaction };
