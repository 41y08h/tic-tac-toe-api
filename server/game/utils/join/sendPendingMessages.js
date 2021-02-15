const events = require("../../config/events");

function sendPendingMessages(io, room) {
  // Sends the messages to the second connected user,
  // that the first connected user might have sent

  const player = room.players[1];
  io.to(player.socketId).emit(events.message, ...room.messages);
}

module.exports = sendPendingMessages;
