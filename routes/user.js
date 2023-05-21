const _ = require("lodash");
const routeUtils = require("../utils/index.js");
const { getCompleteById, requireRole } = require("../controllers/user.js");

module.exports = [
  // Get user by id
  {
    method: "GET",
    path: "/users/{userId}",
    config: {
      description: "Get a user by id",
      tags: ["Users"],
    },
    handler: async (request, h) => {
      try {
        const { userId } = request.params;

        if (!userId) {
          // Bad request (400) if no userId is provided
          throw 400;
        }

        // Require authenticated user to be an admin
        await requireRole(request.auth.credentials.user);

        const res = await getCompleteById(userId);

        return routeUtils.replyWith.found(res, h);
      } catch (err) {
        return routeUtils.handleErr(err, h);
      }
    },
  },
  // Read self
  {
    method: "GET",
    path: "/users/self",
    config: {
      description: "Read a user",
      tags: ["Users"],
    },
    handler: async (request, h) => {
      try {
        const { user } = request.auth.credentials;
        const res = await user.getComplete();
        return routeUtils.replyWith.found(res, h);
      } catch (err) {
        return routeUtils.handleErr(err, h);
      }
    },
  },
];
