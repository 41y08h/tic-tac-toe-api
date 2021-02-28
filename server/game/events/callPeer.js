const getRoomId = require("../utils/common/getRoomId");
const events = require("../config/events");

const onCallPeer = (socket, io) => () => {
  const roomId = getRoomId(socket);

  socket.to(roomId).broadcast.emit(events.opponentIsCalling);
};

module.exports = onCallPeer;
