const config = require("../config");

function configureSocketIo(server) {
  const io = require("socket.io").listen(server, {
    origins: [config.clientURL],
    handlePreflightRequest: (req, res) => {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": config.clientURL,
        "Access-Control-Allow-Methods": "GET,POST",
        "Access-Control-Allow-Credentials": true,
      });
      res.end();
    },
  });

  return io;
}

module.exports = configureSocketIo;
