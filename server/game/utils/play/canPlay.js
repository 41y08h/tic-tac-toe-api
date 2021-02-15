function canPlay(room, socketId, boardIndex) {
  const { currentPlayer } = room;
  if (!currentPlayer) return;

  const isRightPlayer = currentPlayer.socketId === socketId;
  const winnerDeclared = room.winner;
  const boardIndexIsFilled = room.board[boardIndex];

  const canPlay = isRightPlayer && !winnerDeclared && !boardIndexIsFilled;

  return canPlay;
}

module.exports = canPlay;
