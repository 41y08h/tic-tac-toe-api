function getNewBoard(board, index, symbol) {
  const newBoard = board.slice();
  newBoard[index] = symbol;

  return newBoard;
}

module.exports = getNewBoard;
