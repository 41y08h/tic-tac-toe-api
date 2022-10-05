const mongoose = require("mongoose");
const debug = require("debug")("app:database");
const { mongoURI, port } = require("./config");
const configureGame = require("./game/configureGame");

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

async function main() {
  const environment = process.env.NODE_ENV;
  debug(`started in ${environment} mode on port ${port}`);

  await connectDatabase();
  configureGame();
}

main();
