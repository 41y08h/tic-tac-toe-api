const debug = require("debug")("app:game");
const Room = require("../../models/Room");

async function deleteRooms() {
  const environment = process.env.NODE_ENV;
  if (environment !== "development") return;
  await Room.deleteMany();
  debug("deleted previous rooms");
}

module.exports = deleteRooms;
