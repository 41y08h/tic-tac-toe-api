const Rooms = require("./Rooms");

module.exports = class Game {
  constructor() {
    this.board = Array(9).fill(null);
    this.player = 0;
    this.winner = null;
    this.messages = [];
  }

  chat(message, io, socket, room) {
    this.messages.push(message);
    const lastMessage = this.messages[this.messages.length - 1];
    const socketId = socket.id;
    const firstUserId = room.users[0];
    const secondUserId = room.users[1];
    if (socketId === firstUserId) {
      // First user is winner
      io.to(firstUserId).emit("message", { isOfPlayer: true, message });
      io.to(secondUserId).emit("message", { isOfPlayer: false, message });
    } else if (socketId === secondUserId) {
      // Second user is winner
      io.to(secondUserId).emit("message", { isOfPlayer: true, message });
      io.to(firstUserId).emit("message", { isOfPlayer: false, message });
    }
  }

  play(socket, room, index, callback) {
    // Don't play if there's not enough users
    if (room.users.length < 2) return;
    // Don't play if winner is already declared
    if (this.winner != null) return;
    // Invalid user played
    if (!(room.users[this.player] === socket.id)) return;
    const newBoard = this.board.slice();
    if (this.board[index]) return;
    if (this.player === 0) {
      newBoard[index] = "X";
      this.player = 1;
    } else if (this.player === 1) {
      newBoard[index] = "O";
      this.player = 0;
    }
    this.board = newBoard;

    if (callback) callback();
  }

  checkWinner() {
    const { board } = this;

    // Check for any draw match
    if (board.filter((value) => value).length === 9) {
      this.winner = 2;
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
          this.winner = 0;
        } else if (stack[0] === "O") {
          this.winner = 1;
        }
      }
    });
    return this.winner;
  }
};
