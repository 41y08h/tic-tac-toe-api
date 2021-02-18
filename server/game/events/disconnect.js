const Room = require("../models/Room");
const debug = require("debug")("app:game:disconnect");
const getRoomId = require("../utils/common/getRoomId");
const notifications = require("../config/notifications");
const sendNotification = require("../utils/common/sendNotification");
const events = require("../config/events");

const onDisconnect = (socket, io) => async () => {
  debug(`someone disconnected with an id of ${socket.id}`);

  // Remove the disconnected player from the database
  const match = { socketId: socket.id };
  const query = { players: { $elemMatch: match } };
  const update = { players: { $pull: { $elemMatch: match } } };

  await Room.updateOne(query, update);

  // Delete rooms with 0 players
  await Room.deleteMany({ players: { $size: 0 } });

  // Send notification
  const event = events.notification;
  const playload = notifications.opponenetLeftGame;
  socket.broadcast.emit(event, playload);
};

module.exports = onDisconnect;
