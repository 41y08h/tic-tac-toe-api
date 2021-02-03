const path = require("path");
const onJoin = require("../events/join");
const handleEventsByFileSystem = require("./handleEventsByFileSystem");

function configureGame(io) {
  io.on("connection", (socket) => {
    const pathToEventsDirectory = path.join(__dirname, "../events/");
    onJoin(socket, io).then(() =>
      handleEventsByFileSystem(socket, io, pathToEventsDirectory)
    );
  });
}

module.exports = configureGame;
