const Room = require("../models/Room");
const eventConstants = require("../config/eventConstants");

async function onJoin(socket, io) {
  let room = await Room.findOne().sort({ _id: -1 }).limit(1);
  const hasSeats = room && !room.used;

  if (hasSeats) {
    room.players.push(socket.id);
    room.playingNow = room.players[0];
    room.used = true;

    room = await room.save();

    await socket.join(room.id);
    io.to(room.playingNow).emit(
      eventConstants.notification,
      "It's your turn !"
    );
    socket.emit(eventConstants.notification, "Your opponent is playing !");

    socket.emit(eventConstants.messages, room.messages);
  } else {
    room = new Room({
      players: [socket.id],
    });
    room = await room.save();

    await socket.join(room.id);

    socket.emit(eventConstants.notification, "Waiting for your opponent !");
  }

  // Sync board
  io.to(room.id).emit(eventConstants.play, room.board);
}

module.exports = onJoin;
