const path = require("path");

// NODE_ENV should only be set to "production" or "development"
const NODE_ENV = process.env.NODE_ENV || "development";
// SERVER_ENV can be set to any environment name such as "test"
const SERVER_ENV = process.env.SERVER_ENV || NODE_ENV || "development";

require("dotenv").config({
  // Specify dotenv by environment
  path: path.join(__dirname, `../.env.${SERVER_ENV}`),
});

// API Server Configurations
const HOST = process.env.HOST || "localhost";
const ADDRESS = process.env.ADDRESS || "0.0.0.0";
const PORT = process.env.PORT || 5551;
const API_VERSION = process.env.API_VERSION || "v0";

// Database Configurations
const DATABASE_NAME = process.env.DATABASE_NAME || "api_challenge";
const DATABASE_USERNAME = process.env.DATABASE_USERNAME || "postgres";
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "postgres";
const DATABASE_HOST = process.env.DATABASE_HOST || "localhost";
const DATABASE_PORT = process.env.DATABASE_PORT || 5432;

// Debugging
const isDevelopment = SERVER_ENV !== "test" && SERVER_ENV !== "production"; // Disable debugging in test and production
const DEBUG = process.env.DEBUG || isDevelopment; // Set DEBUG=true to see logs
const SILENT_OPS = process.env.SILENT_OPS || !isDevelopment; // Set SILENT_OPS=true to silence console.info

// SSL
const RSA_PUBLIC_KEY =
  process.env.RSA_PUBLIC_KEY ||
  "-----BEGIN PUBLIC KEY-----\nMIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGNnZJnyAL1Ts4TnwuYmetowlPnt\na7GwvfCBk7QiGDqNoFGMXfsyRHGW92wGsGyx28L/lrHyJhB3Huh5Y2Qq1OyNAe4K\n1ZZo7Rz3EDaUDTPMe5s0NGd1alMxlTzjh0iAskUAkt9wFe/qtCt9r5RgcGssyANj\nW7HGv43JPJs9XaKLAgMBAAE=\n-----END PUBLIC KEY-----";
const RSA_PRIVATE_KEY =
  process.env.RSA_PRIVATE_KEY ||
  "-----BEGIN RSA PRIVATE KEY-----\nMIICWwIBAAKBgGNnZJnyAL1Ts4TnwuYmetowlPnta7GwvfCBk7QiGDqNoFGMXfsy\nRHGW92wGsGyx28L/lrHyJhB3Huh5Y2Qq1OyNAe4K1ZZo7Rz3EDaUDTPMe5s0NGd1\nalMxlTzjh0iAskUAkt9wFe/qtCt9r5RgcGssyANjW7HGv43JPJs9XaKLAgMBAAEC\ngYBXNF9nRo0riwCUehXbfqqMO86WK5ks+5bGJYcEolyLEbAxmmjgdErjM8O/u2aP\nFMFsonj7hympjDdLTyLIv2KnQG9N5EzPWz72N0Zg5+fNEloxGlbC+XzZIfHxT/Iw\n09ZVxnZFkvKRusplSNmkClvojrJJkJOPnpGyAU07F9cXIQJBALiqH0TEs5C0tqLd\noRfwiFKPGakU70FTpbopKxis1h5POKUFsK5bpCiJAVdlFntQaUgQrFqj6BvvWbZL\nweP7v4MCQQCJzaigEGOR9M1aXcYSG/0Z8jClQrFmpQaT/Ejs6w+Ej2g9HPC8JwIv\nmJnsTfqKzI1NhwulpEaCfkW1/a4FLFpZAkEAiRtuue1d8VvrmoL5f7/MR5gOElcD\nyTok+1JjuB9jnv9s7EGMS/ioqpwGje/1QDuU37fZcDbwOAV/U3VuESqypwJAY8/n\nnJBiXnyvJQ4ZAlLtf5aRr5HgBtXvLs8kTx5vLffla6aDo/SpO6pPiv5sQ46npojz\nYbXcMHafrZMiMbMPeQJAMVw4UhhrdEe2qp8LYymVoHqndsdexfVvGWdy7NmCiY8h\nHSrxVzNrvrM7ECJslvmR/aGXniZLtYWQJ7U1wHdE7w==\n-----END RSA PRIVATE KEY-----";

module.exports = {
  ADDRESS,
  API_VERSION,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DEBUG,
  HOST,
  NODE_ENV,
  PORT,
  RSA_PRIVATE_KEY,
  RSA_PUBLIC_KEY,
  SERVER_ENV,
  SILENT_OPS,
};
