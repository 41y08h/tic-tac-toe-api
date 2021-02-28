const Message = require("../models/Message");
const Room = require("../models/Room");
const getRoomId = require("../utils/common/getRoomId");
const events = require("../config/events");

const onMessage = (socket, io) => async (text) => {
  const message = new Message({ text, bySocketId: socket.id });

  // Update new message in database
  const roomId = getRoomId(socket);

  const query = { _id: roomId };
  const update = { $push: { messages: message } };
  await Room.updateOne(query, update);

  // Emit message in websockets room
  io.in(roomId).emit(events.message, message);
};
module.exports = onMessage;
