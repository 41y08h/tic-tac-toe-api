const config = require("../config");

function configureSocketIo(server) {
  const io = require("socket.io")(server, {
    cors: {
      origin: config.clientURL,
      credentials: true,
    },
  });

  return io;
}

module.exports = configureSocketIo;
