const getRoomId = require("../utils/common/getRoomId");
const events = require("../config/events");

const onRejectCall = (socket, io) => () => {
  const roomId = getRoomId(socket);

  socket.to(roomId).broadcast.emit(events.rejectCall);
};

module.exports = onRejectCall;
