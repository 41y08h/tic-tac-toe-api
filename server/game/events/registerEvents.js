const events = require("../config/events");
const onJoin = require("./join");
const onPlay = require("./play");
const onMessage = require("./message");

async function registerEvents(socket, io) {
  onJoin(socket, io);

  socket.on(events.message, onMessage(socket, io));
  socket.on(events.play, onPlay(socket, io));
}

module.exports = registerEvents;
