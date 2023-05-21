"use strict";

const { start, stop } = require("./lib/hapi.js");

async function init() {
  await start();
}

init();

/**
 * Graceful shutdown
 */
process.on("SIGINT", async () => {
  logger("info", "Gracefully shutting down...");
  await stop();
  process.exit(0);
});
