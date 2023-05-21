const _ = require("lodash");
const User = require("../models/user.js");

/**
 * Find a user by id and return the complete user object
 * @param {string} id - User id
 * @returns {User} User complete data with relationships
 */
async function getCompleteById(id) {
  // Find the user by id
  const user = await User.findByPk(id);
  // Return the complete user object
  return user.getComplete();
}

/**
 * Require the requester to be an admin role
 * @param {User} user - User model instance
 * @param {string} role - Role name to check for
 * @throws 401 - Unauthorized error status code if the role is not found
 * @returns {Promise} Promise that resolves if the user is an admin
 */
async function requireRole(user, role = "admin") {
  // Get the user's roles
  const res = await user.roles();

  if (res.includes(role)) {
    // Resolve if the user has the required role
    return;
  }

  // Unauthorized (401) if the user does not have the required role
  throw 401;
}

module.exports = {
  getCompleteById,
  requireRole,
};
