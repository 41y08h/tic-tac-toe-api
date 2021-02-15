function getLoser(room) {
  return room.players.find((player) => player.id !== room.winner.id);
}
module.exports = getLoser;
