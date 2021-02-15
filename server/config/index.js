/** Configs based on the environment */
const environment = process.env.NODE_ENV;
const config =
  environment === "production" ? require("./prod") : require("./dev");

module.exports = config;
