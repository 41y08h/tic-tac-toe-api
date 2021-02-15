const mongoose = require("mongoose");

const Message = new mongoose.Schema({
  text: { type: String, required: true },
  bySocketId: { type: String, required: true },
});

module.exports = mongoose.model("Message", Message);
