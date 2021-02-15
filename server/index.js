const configureGame = require("./game/configureGame");
const connectDatabase = require("./utils/connectDatabase");
const logStartMessage = require("./utils/logStartMessage");

logStartMessage();
connectDatabase().then(configureGame);
