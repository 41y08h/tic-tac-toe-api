const debug = require("debug")("app");

function startServer(server) {
  const PORT = process.env.PORT || 5000;
  const environment = process.env.NODE_ENV;

  function onServerStart() {
    debug(`started in ${environment} mode at port ${PORT}`);
  }

  return server.listen(PORT, onServerStart);
}

module.exports = startServer;
