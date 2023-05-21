"use strict";

const _ = require("lodash");
const {
  API_URI,
  expect,
  sequelize,
  server,
  userWithToken,
} = require("../utils/test-utils.js");

describe("User CRUD operations -", () => {
  describe("GET /users/{userId}", () => {
    it("should read a given user's information if requester is an admin", async () => {
      // Create an admin user and a JWT access token
      const { accessToken } = await userWithToken({
        roles: ["admin"],
      });

      const user = await sequelize.models.User.findByPk(1);
      const userResult = await user.getComplete();

      // Make the request
      const { statusCode, result } = await server.inject({
        method: "get",
        url: `${API_URI}/users/1`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Check the response
      expect(statusCode).to.equal(200);
      expect(result).to.deep.equalInAnyOrder(userResult);
    });
    it("should return 401 unauthorized if requester is not an admin", async () => {
      // Create a user and a JWT access token for that user
      const { accessToken } = await userWithToken();

      // Make the request
      const serverInjection = await server.inject({
        method: "get",
        url: `${API_URI}/users/1`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Check the response
      expect(serverInjection).to.be.unauthorized;
    });
  });

  describe("GET /self", () => {
    it("should read own information", async () => {
      // Create a user and a JWT access token
      const { user, accessToken } = await userWithToken({
        roles: ["owner", "member"],
      });
      const completeUser = await user.getComplete();

      // Make the request
      const { statusCode, result } = await server.inject({
        method: "get",
        url: `${API_URI}/users/self`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert a proper response
      expect(statusCode).to.equal(200);
      expect(result.id).to.equal(completeUser.id);
      expect(result.uuid).to.equal(completeUser.uuid);
      expect(result.email).to.equal(completeUser.email);
      expect(result.roles.length).to.equal(2);
      expect(result.roles).to.have.members(["owner", "member"]);
    });
  });
});
