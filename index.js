"use strict";

const {
  start,
  registerModels,
  registerAuth,
  registerRoutes,
} = require("./lib/hapi.js");

async function init() {
  await registerModels();
  await registerAuth();
  await registerRoutes();
  await start();
}

init();
