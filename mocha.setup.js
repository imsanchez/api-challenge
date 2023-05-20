const { start, stop } = require("./lib/hapi.js");

before(async () => {
  return new Promise((resolve, reject) => {
    start(() => {
      resolve();
    });
  });
});

after(async () => {
  return new Promise((resolve, reject) => {
    stop(() => {
      resolve();
    });
  });
});
