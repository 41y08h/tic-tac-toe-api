const Room = require("../models/Room");
const eventConstants = require("./eventConstants");

const onMessage = (socket, io) => async (text) => {
  const message = { playerId: socket.id, text };
  await Room.updateOne(
    { players: socket.id },
    { $push: { messages: message } }
  );

  const { _id: roomId } = await Room.findOne({ players: socket.id })
    .select("_id")
    .exec();

  io.to(roomId).emit(eventConstants.message, message);
};

module.exports = onMessage;
