const Room = require("../models/Room");
const debug = require("debug")("app:game:disconnect");
const notifications = require("../config/notifications");
const sendNotification = require("../utils/common/sendNotification");
const events = require("../config/events");

const onDisconnect = (socket, io) => async () => {
  debug(`someone disconnected with an id of ${socket.id}`);

  // Remove the disconnected player from the database
  const query = { players: { $elemMatch: { socketId: socket.id } } };
  const room = await Room.findOne(query).select("players").exec();

  room.players = room.players.filter((player) => player.socketId !== socket.id);
  await room.save();

  // Let the other player know that his opponent disconnected
  io.in(room.id).emit(events.isOpponentConnected, false);

  // Delete rooms with 0 players
  await Room.deleteMany({ players: { $size: 0 } });

  // Send notification
  const notificationToSend = {
    text: notifications.opponenetLeftGame,
    toId: room.id,
  };
  sendNotification(io, notificationToSend);

  const roomCount = await Room.countDocuments();
  debug(`${roomCount} room${roomCount > 1 ? "s" : ""} online`);
};

module.exports = onDisconnect;
