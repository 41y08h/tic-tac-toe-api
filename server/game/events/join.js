const debug = require("debug")("app:game:join");
const Room = require("../models/Room");
const Join = require("../utils/join/Join");

async function onJoin(socket, io) {
  const existingRoom = await Room.findOne({ needPeer: true }).sort({ _id: -1 });

  existingRoom
    ? await Join.toExistingRoom(socket, io, existingRoom)
    : await Join.toNewRoom(socket, io);

  debug(`someone joined with an id of ${socket.id}`);

  const roomCount = await Room.countDocuments();
  debug(`${roomCount} room${roomCount > 1 ? "s" : ""} online`);
}
module.exports = onJoin;
