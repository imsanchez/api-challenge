"use strict";

const _ = require("lodash");
const {
  API_URI,
  addRoleToUser,
  expect,
  sequelize,
  server,
} = require("../utils/test-utils.js");

const scope = {};

describe("Role CRUD operations -", () => {
  describe("GET /roles", () => {
    it("should list all application roles if requester is an admin", async () => {
      // Create a user and a JWT access token for that user
      scope.adminUser = await sequelize.models.User.create({
        email: `admin@example.com`,
      });
      scope.adminAccessToken = await scope.adminUser.generateAccessToken();

      // Add the admin role for the user
      await addRoleToUser(scope.adminUser, "admin");

      // Make the request
      const { statusCode, result } = await server.inject({
        method: "get",
        url: `${API_URI}/roles`,
        headers: {
          authorization: `Bearer ${scope.adminAccessToken}`,
        },
      });

      // Check the response
      expect(statusCode).to.equal(200);
      expect(result.results.length).to.equal(
        sequelize.models.Role.defaultRoles.length
      );
      expect(result.results).to.have.members(
        sequelize.models.Role.defaultRoles
      );
    });

    it("should return 401 unauthorized if not an admin", async () => {
      // Create a user and a JWT access token for that user
      scope.user = await sequelize.models.User.create({
        email: `user@example.com`,
      });
      scope.accessToken = await scope.user.generateAccessToken();

      // Make the request
      const serverInjection = await server.inject({
        method: "get",
        url: `${API_URI}/roles`,
        headers: {
          authorization: `Bearer ${scope.accessToken}`,
        },
      });

      // Check the response
      expect(serverInjection).to.be.unauthorized;
    });
  });
});
