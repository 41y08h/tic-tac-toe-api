const events = require("../config/events");
const getRoomId = require("../utils/common/getRoomId");

const onEndCall = (socket, io) => () => {
  const roomId = getRoomId(socket);

  socket.to(roomId).broadcast.emit(events.callEnded);
};

module.exports = onEndCall;
