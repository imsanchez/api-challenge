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
 * @example expect(Server.inject).to.be.unauthorized;
 * @example expect(Server.inject).to.not.be.unauthorized;
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

const resetTable = (modelName) => {
  if (modelName === "Utils") return;
  if (!modelName) throw new Error("modelName undefined");
  return sequelize.models[modelName].sync({ force: true, logging: false });
};

const resetDb = async () => {
  await resetTable("User");
  await resetTable("Role");
  await resetTable("UserRoles");
  return Promise.resolve();
};

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
 */
const assignRoleForUser = async ({ user, roleName }) => {
  const role = await sequelize.models.Role.findOne({
    where: { name: roleName },
  });
  return user.addRole(role.id);
};

/**
 * Create an example admin user for testing
 *
 * @returns {string} JWT access token
 */
const userWithToken = async ({ roles } = {}) => {
  // Create an example user
  const user = await sequelize.models.User.create({
    email: `user@example.com`,
  });

  if (roles instanceof Array) {
    // Add each role for the user
    await Promise.all(
      roles.map(
        async (roleName) =>
          await assignRoleForUser({
            user,
            roleName,
          })
      )
    );
  }

  // Generate JWT access token for the example user
  const accessToken = await user.generateAccessToken();

  return {
    user,
    accessToken,
  };
};

const API_URI = `${server.info.uri}/${API_VERSION}`;

const { expect } = chai;

module.exports = {
  assignRoleForUser,
  expect,
  resetDb,
  resetTable,
  sequelize,
  server,
  setupDb,
  API_URI,
  userWithToken,
};
