const {
  playerIsPlaying,
  opponentIsPlaying,
} = require("../../config/notifications");
const getIdlePlayer = require("./getIdlePlayer");
const sendNotification = require("./sendNotification");

function sendPlayingStatus(room, io) {
  const currentPlayerId = room.currentPlayer.socketId;
  const idlePlayerId = getIdlePlayer(room).socketId;

  const notificationsToSend = [
    { text: playerIsPlaying, toId: currentPlayerId },
    { text: opponentIsPlaying, toId: idlePlayerId },
  ];

  sendNotification(io, ...notificationsToSend);
}

module.exports = sendPlayingStatus;
