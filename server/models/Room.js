const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const schema = new mongoose.Schema({
  players: {
    type: Array,
    default: [],
  },
  messages: [messageSchema],
  board: {
    type: Array,
    default: Array(9).fill(""),
  },
  playingNow: String,
  winner: String,
  used: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("room", schema);
