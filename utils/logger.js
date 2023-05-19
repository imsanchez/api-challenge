const { SILENT_OPS } = require("./config");

const logger = {
  log: (...args) => DEBUG && console.log(...args),
  info: (...args) => !SILENT_OPS && console.info(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args),
};

module.exports = (type, ...args) => logger[type](...args);
