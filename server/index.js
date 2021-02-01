const express = require("express");
const app = express();

const configureGame = require("./utils/configureGame");
const connectDatabase = require("./utils/connectDatabase");
const startServer = require("./utils/startServer");

const server = startServer(app);
const io = require("socket.io").listen(server);

connectDatabase();
configureGame(io);
