const Room = require("../models/Room");
const { events } = require("../config/game");

const onMessage = (socket, io) => async (text) => {
  const message = { playerId: socket.id, text };

  // Update new message in database
  const query = { players: socket.id };
  const update = { $push: { messages: message } };
  await Room.updateOne(query, update);

  // Emit message in websockets room
  const roomId = Object.keys(socket.rooms)[1];
  io.in(roomId).emit(events.message, message);
};

module.exports = onMessage;
