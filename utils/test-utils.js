const _ = require("lodash");
const chai = require("chai");
const deepEqualInAnyOrder = require("deep-equal-in-any-order");

const { server } = require("../lib/hapi.js");
const sequelize = require("../lib/sequelize.js");
const { API_VERSION } = require("./config.js");

chai.use(deepEqualInAnyOrder);

const { expect } = chai;

chai.Assertion.addProperty("unauthorized", function () {
  this.assert(
    this._obj.statusCode === 401,
    "expected #{this} to be unauthorized",
    "expected #{this} to not be unauthorized",
    "unauthorized",
    this._obj.statusCode
  );
  this.assert(
    this._obj.result.message === "Unauthorized",
    "expected #{this} to be unauthorized",
    "expected #{this} to not be unauthorized",
    "unauthorized",
    this._obj.result.message
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
const userWithToken = async ({ role, roles } = {}) => {
  // Create an example user
  const user = await sequelize.models.User.create({
    email: `user@example.com`,
  });

  if (typeof role === "string") {
    // Add the specified role for the user
    await assignRoleForUser({
      user,
      roleName: role,
    });
  }

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
