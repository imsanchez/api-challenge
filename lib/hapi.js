const fs = require("fs");
const path = require("path");
const Hapi = require("@hapi/hapi");
const AuthJWT = require("hapi-auth-jwt2");

const { validateJwt } = require("../controllers/jwt.js");
const {
  HOST,
  PORT,
  ADDRESS,
  RSA_PUBLIC_KEY,
  API_VERSION,
} = require("../utils/config.js");
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
      plugin: require("../routes/index.js").plugins[API_VERSION],
    },
    { routes: { prefix: `/${API_VERSION}` } }
  );
}

/**
 * Start the Hapi server
 */
async function start() {
  try {
    await registerModels();
    await registerAuth();
    await registerRoutes();
    await server.start();
    logger("log", "Server running on %s", server.info.uri);
  } catch (err) {
    logger("error", err);
    process.exit(1);
  }
}

/**
 * Stop the Hapi server
 */
async function stop() {
  try {
    await server.stop();
    logger("log", "Server stopped");
  } catch (err) {
    logger("error", err);
    process.exit(1);
  }
}

module.exports = {
  server,
  start,
  stop,
};
