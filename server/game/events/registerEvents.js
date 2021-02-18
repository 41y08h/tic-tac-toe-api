const events = require("../config/events");
const onJoin = require("./join");
const onPlay = require("./play");
const onMessage = require("./message");
const onDisconnect = require("./disconnect");

async function registerEvents(socket, io) {
  onJoin(socket, io);

  socket.on(events.message, onMessage(socket, io));
  socket.on(events.play, onPlay(socket, io));
  socket.on(events.disconnect, onDisconnect(socket, io));
}

module.exports = registerEvents;
