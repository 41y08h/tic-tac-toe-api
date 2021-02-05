const config = require("../config");

function configureSocketIo(server) {
  const io = require("socket.io")(server, {
    cors: {
      credentials: true,
      origin: (origin, callback) => callback(null, true),
    },
  });

  return io;
}

module.exports = configureSocketIo;
