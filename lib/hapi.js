const fs = require("fs");
const path = require("path");
const Hapi = require("@hapi/hapi");
const AuthJWT = require("hapi-auth-jwt2");

const { validateJwt } = require("../controllers/jwt.js");
const { HOST, PORT, ADDRESS, RSA_PUBLIC_KEY } = require("../utils/config.js");
const logger = require("../utils/logger.js");

const server = Hapi.Server({
  host: HOST,
  port: PORT,
  address: ADDRESS,
  routes: {
    security: true, // Enable HSTS headers
    cors: {
      origin: ["*"],
      credentials: true,
      maxAge: 604800, // 1 week
    },
    files: {
      relativeTo: path.join(__dirname, "../public"),
    },
  },
});

async function registerModels() {
  const modelFileNames = fs.readdirSync(path.resolve(__dirname, "../models"));
  modelFileNames.forEach((fileName) => {
    require(`../models/${fileName}`);
  });
}

// Auth
async function registerAuth() {
  // JWT authentication
  await server.register({ plugin: AuthJWT });
  server.auth.strategy("jwt", "jwt", {
    key: RSA_PUBLIC_KEY,
    validate: validateJwt,
    validateOptions: { payload: true },
    verifyOptions: { algorithms: ["RS256"] },
  });

  // Default is JWT
  server.auth.default("jwt");
}

async function registerRoutes() {
  // v0 routes
  await server.register(
    {
      plugin: require("../routes/index.js")["plugin"]["v0"],
    },
    { routes: { prefix: "/v0" } }
  );
}

// Start and Stop
async function stop(cb) {
  await server.stop();
  if (typeof cb === "function") cb();
  logger("log", "Server stopped");
}

async function start(cb) {
  await server.start();
  if (typeof cb === "function") cb();
  logger("log", "Server running on %s", server.info.uri);
}

module.exports = {
  server,
  start,
  stop,
  registerModels,
  registerAuth,
  registerRoutes,
};
