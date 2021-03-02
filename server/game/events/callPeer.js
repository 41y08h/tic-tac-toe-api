const getRoomId = require("../utils/common/getRoomId");
const events = require("../config/events");
const debug = require("debug")("app:game:call");

const onCallPeer = (socket, io) => (callerSignal) => {
  const roomId = getRoomId(socket);

  socket.to(roomId).broadcast.emit(events.opponentIsCalling, callerSignal);

  debug(`call initiated by ${socket.id}`);
};

module.exports = onCallPeer;
