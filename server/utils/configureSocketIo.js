const config = require("../config");

function configureSocketIo(server) {
  const io = require("socket.io")(server, { cors: { origin: "*" } });

  return io;
}

module.exports = configureSocketIo;
