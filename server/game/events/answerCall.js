const getRoomId = require("../utils/common/getRoomId");
const events = require("../config/events");
const debug = require("debug")("app:game:call");

const onAnswerCall = (socket, io) => (receiverSignal) => {
  const roomId = getRoomId(socket);

  socket.to(roomId).broadcast.emit(events.callAnswered, receiverSignal);

  debug(`call answered by ${socket.id}`);
};

module.exports = onAnswerCall;
