const getWinningStacks = require("./getWinningStacks");

const allEqual = (arr) => arr.every((v) => v === arr[0]);

function getWinner(room) {
  // Null ~ Tie game
  // Undefined ~ No winner yet
  // `Player` ~ Player model who is winner
  let winner = undefined;

  // Valid winning positions in a tic-tac-toe game
  const winningStacks = getWinningStacks(room.board);

  function checkWinner(position) {
    if (allEqual(position)) {
      const winnerSymbol = position[0];
      winner = room.players.find((player) => player.symbol === winnerSymbol);
    }
  }

  // Check if any one of the
  // winning positions has equal values
  winningStacks.forEach(checkWinner);

  // Don't check for tie game if someone is winner already
  if (winner) return winner;

  // Check for tie game
  const filledValues = room.board.filter((value) => value);
  const boardIsFilled = filledValues.length === 9;
  if (boardIsFilled) winner = null;

  return winner;
}

module.exports = getWinner;
