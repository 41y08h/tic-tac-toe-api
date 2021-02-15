const Room = require("../models/Room");
const events = require("../config/events");
const canPlay = require("../utils/play/canPlay");
const getSymbol = require("../utils/play/getSymbol");
const getWinner = require("../utils/play/getWinner");
const getRoomId = require("../utils/common/getRoomId");
const getNewBoard = require("../utils/play/getNewBoard");
const getIdlePlayer = require("../utils/common/getIdlePlayer");
const sendPlayingStatus = require("../utils/common/sendPlayingStatus");
const sendNotification = require("../utils/common/sendNotification");
const notifications = require("../config/notifications");
const getLoser = require("../utils/play/getLoser");

const onPlay = (socket, io) => async (boardIndex) => {
  let room = await Room.findOne({ _id: getRoomId(socket) });

  // Check for valid conditions before proceeding
  const userCanPlay = canPlay(room, socket.id, boardIndex);
  if (!userCanPlay) return;

  // Update the board in the database and change player
  const newBoard = getNewBoard(room.board, boardIndex, getSymbol(room));
  const idlePlayer = getIdlePlayer(room);

  room.board = newBoard;
  room.currentPlayer = idlePlayer;
  room = await room.save();

  // Emit new board to all players in the room
  io.to(room.id).emit(events.play, room.board);

  // Handle winning state
  const winner = getWinner(room);

  // No winner yet
  if (winner === undefined) {
    return sendPlayingStatus(room, io);
  }

  room.winner = winner;
  room = await room.save();

  // Tie game
  if (winner === null) {
    const notification = { text: notifications.tieGame, toId: room.id };
    return sendNotification(io, notification);
  }

  // Someone is winner
  const notificationsToSend = [
    { text: notifications.winner, toId: room.winner.socketId },
    { text: notifications.loser, toId: getLoser(room).socketId },
  ];
  sendNotification(io, ...notificationsToSend);
};
module.exports = onPlay;
