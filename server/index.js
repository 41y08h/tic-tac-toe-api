const express = require("express");
const app = express();

const configureGame = require("./utils/configureGame");
const connectDatabase = require("./utils/connectDatabase");
const startServer = require("./utils/startServer");
const configureSocketIo = require("./utils/configureSocketIo");

const server = startServer(app);
const io = configureSocketIo(server);

connectDatabase().then(() => configureGame(io));
