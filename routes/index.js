"use strict";
/*
  POST	 /model	      models#create	  create the new model
  GET	   /model/:id   models#find	    read the one and only model resource
  GET	   /model       models#findAll  read all the model resources
  PUT    /model/:id   models#update	  update the one and only model resource
  DELETE /model/:id   models#delete   delete the model resource
*/
const userRoutes = require("./user.js");
const roleRoutes = require("./role.js");
const { API_VERSION } = require("../utils/config.js");

const statusRoute = {
  method: "GET",
  path: "/status",
  handler: () => "OK",
  config: {
    auth: false,
  },
};

const routes = [].concat(userRoutes, roleRoutes, statusRoute);

/**
 * @todo Add some sort of shield to protect routes according to roles, default all routes to unauthorized
 * Use dictionaries of routes and roles e.g. { "/users/{userId}": ["admin"]}
 * this will reduce repetion of requireRole() in each protected route and consolidate this configuration and logic
 */

const plugins = {
  v0: {
    name: "apiV0",
    version: "0.1.0",
    register: async function (server) {
      routes.forEach((route) => {
        server.route(route);
      });
    },
    routes: {
      prefix: "/v0",
    },
  },
};

if (!Object.keys(plugins).includes(API_VERSION)) {
  throw new Error(`API_VERSION ${API_VERSION} is not supported`);
}

module.exports = {
  routes,
  plugins,
};
