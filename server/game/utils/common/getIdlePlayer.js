function getIdlePlayer(room) {
  return room.players.find((player) => player.id !== room.currentPlayer.id);
}

module.exports = getIdlePlayer;
