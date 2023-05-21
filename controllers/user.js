const _ = require("lodash");
const User = require("../models/user.js");

/**
 * Find a user by id and return the complete user object
 * @param {string} id - User id
 * @returns {User}
 */
async function getCompleteById(id) {
  const user = await User.findByPk(id);
  return user.getComplete();
}

/**
 * Require the requester to be an admin role
 * @param {User} user - User model instance
 * @throws 401
 * @returns void
 */
async function requireRole(user, requirement = "admin") {
  const res = await user.roles();

  if (!res.includes(requirement)) {
    throw 401;
  }

  return;
}

module.exports = {
  getCompleteById,
  requireRole,
};
