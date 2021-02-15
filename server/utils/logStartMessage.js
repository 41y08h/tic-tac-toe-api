const debug = require("debug")("app");
const { port } = require("../config");

function logStartMessage() {
  const environment = process.env.NODE_ENV;
  debug(`started in ${environment} mode on port ${port}`);
}

module.exports = logStartMessage;
