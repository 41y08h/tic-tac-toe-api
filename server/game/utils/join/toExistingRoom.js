const Player = require("../../models/Player");
const getIdlePlayer = require("../common/getIdlePlayer");
const notifications = require("../../config/notifications");
const sendNotification = require("../common/sendNotification");
const sendPendingMessages = require("./sendPendingMessages");
const events = require("../../config/events");

async function toExisting(socket, io, room) {
  const player = new Player({ socketId: socket.id, symbol: "O" });

  // Add the new player to existing room
  // Set peer need to false
  // Start the game by declaring currentPlayer
  room.players.push(player);
  room.needPeer = false;
  room.currentPlayer = room.players[0];
  await room.save();

  // Join socket to room in websockets world
  await socket.join(room.id);

  // Send appropriate notifications to both users
  const currentPlayer = room.currentPlayer;
  const idlePlayer = getIdlePlayer(room);

  const notificationsToSend = [
    { text: notifications.playerIsPlaying, toId: currentPlayer.socketId },
    { text: notifications.opponentIsPlaying, toId: idlePlayer.socketId },
  ];

  sendNotification(io, ...notificationsToSend);
  sendPendingMessages(io, room);

  // Send to both the players that their respective opponent is connected
  io.in(room.id).emit(events.isOpponentConnected, true);
}

module.exports = toExisting;
