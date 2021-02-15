function getRoomId(socket) {
  const roomId = Array.from(socket.rooms)[1];
  return roomId;
}

module.exports = getRoomId;
