const onPlay = require("../events/onPlay");
const onJoin = require("../events/onJoin");
const onMessage = require("../events/onMessage");
const onDisconnect = require("../events/onDisconnect");
const eventConstants = require("../events/eventConstants");

function configureGame(io) {
  io.on("connection", (socket) => {
    onJoin(socket, io)();
    socket.on(eventConstants.play, onPlay(socket, io));
    socket.on(eventConstants.message, onMessage(socket, io));
    socket.on("disconnect", onDisconnect(socket, io));
  });
}

module.exports = configureGame;
