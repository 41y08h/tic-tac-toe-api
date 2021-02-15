const Player = require("../../models/Player");
const Room = require("../../models/Room");
const notifications = require("../../config/notifications");
const sendNotification = require("../common/sendNotification");

async function toNewRoom(socket, io) {
  const player = new Player({ socketId: socket.id, symbol: "X" });

  const room = new Room({ players: [player] });
  await room.save();
  // Created and added the new player in room

  // Join socket to room in websockets world
  await socket.join(room.id);

  // Send waiting notification
  const text = notifications.firstPlayerWaiting;
  const notification = { text, toId: socket.id };
  sendNotification(io, notification);
}

module.exports = toNewRoom;
