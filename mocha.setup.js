const { stop } = require("./index.js");

after(async () => {
  return new Promise((resolve, reject) => {
    stop(() => {
      resolve();
    });
  });
});
