const Room = require("../models/Room");
const events = require("../config/events");

function configureGame(io) {
  io.on("connection", (socket) => {
    joinRoom(socket);
    listenToMessages(socket);
    listenToPlay(socket);
    handleDisconnection(socket);
  });

  function checkWinner(room) {
    const { board } = room;

    let winner = null;

    // Check for any draw match
    if (board.filter((value) => value).length === 9) {
      winner = "DRAW";
    }

    // Valid stacks for winning
    const winningStacks = [
      [board[0], board[1], board[2]],
      [board[3], board[4], board[5]],
      [board[6], board[7], board[8]],
      [board[0], board[3], board[6]],
      [board[1], board[4], board[7]],
      [board[2], board[5], board[8]],
      [board[0], board[4], board[8]],
      [board[2], board[4], board[6]],
    ];

    // Check if any stack has same values
    winningStacks.forEach((stack) => {
      if (
        stack[0] === stack[1] &&
        stack[1] === stack[2] &&
        stack[0] &&
        stack[1] &&
        stack[2]
      ) {
        // There's a winner, that's stack[0]
        if (stack[0] === "X") {
          winner = room.players[0];
        } else if (stack[0] === "O") {
          winner = room.players[1];
        }
      }
    });
    return winner;
  }
  async function joinRoom(socket) {
    let room = await Room.findOne().sort({ _id: -1 }).limit(1);
    const hasSeats = room && !room.used;

    if (hasSeats) {
      room.players.push(socket.id);
      room.playingNow = room.players[0];
      room.used = true;

      room = await room.save();

      await socket.join(room.id);
      io.to(room.playingNow).emit(events.notification, "It's your turn !");
      socket.emit(events.notification, "Your opponent is playing !");

      socket.emit(events.messages, room.messages);
    } else {
      room = new Room({
        players: [socket.id],
      });
      room = await room.save();

      await socket.join(room.id);

      socket.emit(events.notification, "Waiting for your opponent !");
    }

    // Sync board
    io.to(room.id).emit(events.play, room.board);
  }

  async function listenToMessages(socket) {
    socket.on(events.message, async (text) => {
      const message = { playerId: socket.id, text };
      await Room.updateOne(
        { players: socket.id },
        { $push: { messages: message } }
      );

      const { _id: roomId } = await Room.findOne({ players: socket.id })
        .select("_id")
        .exec();

      io.to(roomId).emit(events.message, message);
    });
  }

  async function listenToPlay(socket) {
    socket.on(events.play, async (boardIndex) => {
      let room = await Room.findOne({
        players: socket.id,
      });

      // Don't play if the game hasn't started yet or if the player is not allowed
      if (room.playingNow != socket.id) return;

      // Don't play if the game is over
      if (room.winner) return;

      // Don't play if the board index is already filled
      if (room.board[boardIndex]) return;

      const playerIndex = room.players.findIndex((p) => p === socket.id);
      const nextPlayerIndex = playerIndex === 0 ? 1 : 0;
      const symbol = playerIndex === 0 ? "X" : "O";

      const newBoard = room.board.slice();
      newBoard[boardIndex] = symbol;

      room.board = newBoard;
      room.playingNow = room.players[nextPlayerIndex];
      room = await room.save();

      io.to(room.id).emit(events.play, room.board);

      // Check for winner
      const someoneHasWon = checkWinner(room);

      if (someoneHasWon) {
        if (someoneHasWon === "DRAW")
          return io.to(room.id).emit(events.notification, "👔 Tie game!");

        room.winner = someoneHasWon;
        await room.save();
        const notWinnerId = room.players.find((t) => t !== someoneHasWon);
        io.to(someoneHasWon).emit(events.notification, "🎉🎉 You won 🎉🎉");
        io.to(notWinnerId).emit(events.notification, "Better luck next time !");
        return;
      }

      socket.emit(events.notification, "Your opponent is playing !");
      io.to(room.players[nextPlayerIndex]).emit(
        events.notification,
        "It's your turn !"
      );
    });
  }

  async function handleDisconnection(socket) {
    socket.on("disconnect", async () => {
      const room = await Room.findOne({ players: socket.id })
        .select("_id")
        .exec();

      await Room.updateOne(
        { players: socket.id },
        { $pull: { players: socket.id } }
      );
      await Room.deleteMany({ players: { $size: 0 } });

      io.to(room.id).emit(events.notification, "Your opponent left the game!");
    });
  }
}

module.exports = configureGame;
