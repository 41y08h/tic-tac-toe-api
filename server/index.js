const express = require("express");
const http = require("http");
const app = express();

const configureGame = require("./utils/configureGame");
const connectDatabase = require("./utils/connectDatabase");
const startServer = require("./utils/startServer");
const configureSocketIo = require("./utils/configureSocketIo");

const server = http.createServer(app);
const io = configureSocketIo(server);

connectDatabase()
  .then(() => configureGame(io))
  .then(() => startServer(server));
