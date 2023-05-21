const _ = require("lodash");
const routeUtils = require("../utils/index.js");
const Role = require("../models/role.js");
const { requireRole } = require("../controllers/user.js");

module.exports = [
  // Read all roles
  {
    method: "GET",
    path: "/roles",
    config: {
      description: "Read all roles",
      tags: ["Roles"],
    },
    handler: async (request, h) => {
      try {
        // Require authenticated user to be an admin
        await requireRole(request.auth.credentials.user);

        const roles = await Role.findAll();
        const res = _.map(roles, "name");

        return routeUtils.replyWith.found(res, h);
      } catch (err) {
        return routeUtils.handleErr(err, h);
      }
    },
  },
];
