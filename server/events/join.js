const Room = require("../models/Room");
const { events, notifications, game } = require("../config/game");

async function joinFirstPlayer(socket) {
  // Create a new room in database
  const room = new Room({ players: [socket.id] });
  await room.save();

  // Join in websockets room and emit waiting notification
  await socket.join(room.id);
  socket.emit(events.notification, notifications.firstPlayerWaiting);
}

async function joinSecondPlayer(room, socket, io) {
  // Database update: push second player, set who will play first and set room is used
  room.players.push(socket.id);
  room.playingNow = room.players[game.firstPlayerIndex];
  room.used = true;
  await room.save();

  const notPlayingNow = room.players.find((p) => p !== room.playingNow);

  // Join in websockets room and emit appropriate notifications
  await socket.join(room.id);
  io.to(room.playingNow).emit(
    events.notification,
    notifications.playerIsPlaying
  );

  io.to(notPlayingNow).emit(
    events.notification,
    notifications.opponentIsPlaying
  );

  // Send pending messages that the first player might have sent
  io.to(notPlayingNow).emit(events.message, ...room.messages);
}

/** Runs when the socket joins */
async function onJoin(socket, io) {
  // Find the last room created
  let room = await Room.findOne().sort({ _id: -1 }).limit(1).exec();
  const isFirstPlayer = !(room && !room.used);

  isFirstPlayer ? joinFirstPlayer(socket) : joinSecondPlayer(room, socket, io);
}

module.exports = onJoin;
