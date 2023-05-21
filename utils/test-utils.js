const _ = require("lodash");
const chai = require("chai");
const deepEqualInAnyOrder = require("deep-equal-in-any-order");

const { server } = require("../lib/hapi.js");
const sequelize = require("../lib/sequelize.js");
const { API_VERSION } = require("./config.js");

/**
 * Chai plugin to match objects and arrays deep equality with arrays (including nested ones) being in any order.
 *
 * @link https://github.com/oprogramador/deep-equal-in-any-order#readme
 */
chai.use(deepEqualInAnyOrder);

/**
 * Custom Chai assertion property to check for unauthorized response
 *
 * @example expect(server.inject).to.be.unauthorized;
 * @example expect(server.inject).to.not.be.unauthorized;
 */
chai.Assertion.addProperty("unauthorized", function () {
  // Check for the unauthorized (401) status code
  const statusCode = this._obj.statusCode;
  this.assert(
    statusCode === 401,
    `expected ${statusCode} to be 401`,
    `expected ${statusCode} not to be 401`,
    "unauthorized",
    statusCode
  );

  // Check for the unauthorized message
  const message = this._obj.result.message;
  this.assert(
    message === "Unauthorized",
    `expected "${message}" to be "Unauthorized"`,
    `expected "${message}" not to be "Unauthorized"`,
    "unauthorized",
    message
  );
});

const { expect } = chai;

// API Uri used for test mock requests
const API_URI = `${server.info.uri}/${API_VERSION}`;

/**
 * Reset a table in the database
 * @param {string} modelName - Name of the model to reset
 * @returns {Promise} Promise that resolves when the table is reset
 */
const resetTable = (modelName) => {
  if (!modelName) throw new Error("modelName undefined");
  return sequelize.models[modelName].sync({ force: true, logging: false });
};

/**
 * Reset all tables in the database
 */
const resetDb = async () => {
  await resetTable("User");
  await resetTable("Role");
  await resetTable("UserRoles");
  return;
};

/**
 * Reset database and seed with default roles
 */
const setupDb = async () => {
  try {
    await resetDb();
    await sequelize.models.Role.createDefaultRoles();
  } catch (err) {
    console.error(err);
  }
};

/**
 * Assign a role to a given user
 * @param {object} user - User instance to assign the role to
 * @param {string} roleName - Name of the role to assign
 * @returns {Promise} Promise that resolves when the role is assigned
 */
const addRoleToUser = async (user, roleName) => {
  const role = await sequelize.models.Role.findOne({
    where: { name: roleName },
  });
  return user.addRole(role.id);
};

/**
 * Create an example user with specified roles
 *
 * @param {object} options - Options for the example user
 * @param {string[]} options.roles - Array of role names to assign to the user
 * @returns {object} Object containing the example user and a JWT access token
 */
const userWithToken = async ({ roles } = {}) => {
  // Create a new example user with a random email address
  const prefix = Math.random().toString(36).substring(2, 15);
  const user = await sequelize.models.User.create({
    email: `${prefix}@userfront.com`,
  });

  if (roles instanceof Array) {
    // Assign each role to the user
    await Promise.all(roles.map((roleName) => addRoleToUser(user, roleName)));
  }

  // Generate JWT access token for the example user
  const accessToken = await user.generateAccessToken();

  return {
    user,
    accessToken,
  };
};

module.exports = {
  addRoleToUser,
  expect,
  sequelize,
  server,
  setupDb,
  API_URI,
  userWithToken,
};
