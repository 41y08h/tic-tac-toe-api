const mongoose = require("mongoose");
const debug = require("debug")("app:database");
const { mongoURI } = require("../config");

async function connectDatabase() {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    };
    await mongoose.connect(mongoURI, options);

    debug("connected");
  } catch (err) {
    // Log error and exit, as database is must for the whole app
    console.error(err);
    process.exit(1);
  }
}

module.exports = connectDatabase;
