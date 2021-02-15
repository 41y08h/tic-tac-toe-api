const debug = require("debug")("app:game");
const socketIo = require("socket.io");
const registerEvents = require("./events/registerEvents");
const deleteRooms = require("./utils/common/deleteRooms");
const { port, clientURL } = require("../config");

async function configureGame() {
  const options = { cors: true, origin: clientURL };
  const io = socketIo(port, options);

  io.on("connection", (socket) => registerEvents(socket, io));

  deleteRooms(); // Delete Rooms in development environment

  debug("configured");
}

module.exports = configureGame;
