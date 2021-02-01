const debug = require("debug")("app:database");
const Room = require("../models/Room");
const mongoose = require("mongoose");
const config = require("../config");

async function connectDatabase() {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    debug("connected");

    const environmentIsProduction = process.env.NODE_ENV === "production";
    if (environmentIsProduction) await Room.deleteMany();
  } catch (err) {
    debug(err.message);
    process.exit(1);
  }
}

module.exports = connectDatabase;
