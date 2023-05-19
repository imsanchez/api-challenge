const { start, stop } = require("./lib/hapi.js");
const { setupDb } = require("./utils/test-utils.js");

before(async () => {
  await start();
  await setupDb();
});

after(async () => {
  await stop();
});
