const Room = require("../models/Room");
const eventConstants = require("../config/eventConstants");

const onDisconnect = (socket, io) => async () => {
  const room = await Room.findOne({ players: socket.id }).select("_id").exec();

  await Room.updateOne(
    { players: socket.id },
    { $pull: { players: socket.id } }
  );
  await Room.deleteMany({ players: { $size: 0 } });

  io.to(room.id).emit(
    eventConstants.notification,
    "Your opponent left the game!"
  );
};

module.exports = onDisconnect;
