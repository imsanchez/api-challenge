"use strict";

const { start } = require("./lib/hapi.js");

async function init() {
  await start();
}

init();
