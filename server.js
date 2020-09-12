const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { v4: uuidv4 } = require("uuid");
const Room = require("./utils/Room");
const Rooms = require("./utils/Rooms");
const Game = require("./utils/Game");

// States;
const rooms = new Rooms();

io.on("connection", (socket) => {
  // Check for space in last room;
  const lastRoom = rooms.getLastRoom();
  if (lastRoom && lastRoom.users.length < 2 && !lastRoom.dead) {
    // Config for second user;
    // Space available, throw user in room;
    lastRoom.addUser(socket, (err) => {
      if (err) console.log(err.message);
      else {
        console.log(`Joined user ${socket.id} to last room ${lastRoom.name}`);
        // Notify that the opponent has joined the game;
        socket
          .to(lastRoom.name)
          .broadcast.emit("notification", "It's your turn!");
        // Notify second user that it's first's turn;
        socket.emit("notification", "Your opponent is playing!");
        // Send all messages to second user
        const rawMessages = lastRoom.game.messages;
        const formattedMessages = rawMessages.map((message) => ({
          isOfPlayer: false,
          message,
        }));
        socket.emit("messages", formattedMessages);
      }
    });
  } else {
    // Config for user 1;
    // Space not available, create a new unique room;
    const name = uuidv4();
    rooms.add(new Room(name, [], new Game()));
    rooms.getLastRoom().addUser(socket, (err) => {
      if (err) console.log(err.message);
      else {
        console.log(`Joined user ${socket.id} to new room ${name}`);
        // Send waiting notification to user 1;
        socket.emit("notification", "Waiting for your opponent!");
      }
    });
  }

  // Handle when a user plays
  socket.on("play", (index) => {
    // Get all rooms associated with `socket`
    // with ideally game room to be at index 1
    const socketRooms = Object.keys(socket.rooms);
    const room = rooms.get(socketRooms[1]);
    room.game.play(socket, room, index, () => {
      // Emit board to all users
      room.emitAll(io, "play", room.game.board);
      socket.emit("notification", "Your opponent is playing!");
      room.emitOpponent(io, socket, "notification", "It's your turn!");

      // Check for winner
      const winner = room.game.checkWinner();
      const users = room.users;
      if (winner === null) return;
      // Winner found
      console.log(winner);
      if (winner === 2) {
        room.emitAll(io, "winner", "DRAW");
      } else if (winner === 1) {
        io.to(users[0]).emit("winner", "You lost :(");
        io.to(users[1]).emit("winner", "You won :)");
      } else if (winner === 0) {
        io.to(users[0]).emit("winner", "You won :)");
        io.to(users[1]).emit("winner", "You lost :(");
      }
    });
  });

  socket.on("message", (message) => {
    // Find respective room
    const socketRoomName = Object.keys(socket.rooms)[1];
    const socketRoom = rooms.get(socketRoomName);
    socketRoom.game.chat(message, io, socket, socketRoom);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected!");
    // Remove user from the `room` state
    rooms.rooms.forEach((room) => {
      if (room.users.includes(socket.id)) {
        room.removeUser(socket, (err) => {
          if (err) console.log(err.message);
          else {
            // Notify that the opponent has left the game;
            socket
              .to(room.users)
              .broadcast.emit("notification", "Your opponent left the game!");
            room.die();
          }
        });
      }
    });
    rooms.removeEmpty();
  });
});

const PORT = process.env.PORT || 3001;
http.listen(PORT);
console.log("Rocket launched with payload ${PORT} ===>");
