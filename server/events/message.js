const Room = require("../models/Room");
const eventConstants = require("../config/eventConstants");

const onMessage = (socket, io) => async (text) => {
  const message = { playerId: socket.id, text };
  await Room.updateOne(
    { players: socket.id },
    { $push: { messages: message } }
  );

  const { players } = await Room.findOne({ players: socket.id })
    .select("players")
    .exec();

  players.forEach((playerId) => {
    io.to(playerId).emit(eventConstants.message, message);
  });
};

module.exports = onMessage;
