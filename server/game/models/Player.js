const mongoose = require("mongoose");

const Player = new mongoose.Schema({
  socketId: { type: String, required: true },
  symbol: { type: String, required: true },
});

module.exports = mongoose.model("Player", Player);
