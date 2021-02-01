const environmentIsProduction = process.env.NODE_ENV === "production";

if (environmentIsProduction) module.exports = require("./prod");
else module.exports = require("./dev");
