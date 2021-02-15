const mongoose = require("mongoose");
const Player = require("./Player");
const Message = require("./Message");

const Room = new mongoose.Schema({
  players: [Player.schema],
  messages: [Message.schema],
  winner: mongoose.Schema.Types.Mixed,
  currentPlayer: Player.schema,
  needPeer: { type: Boolean, default: true },
  board: { type: Array, default: Array(9).fill("") },
});

module.exports = mongoose.model("Room", Room);
