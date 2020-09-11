module.exports = class Room {
  constructor(name, users, game) {
    this.name = name;
    this.users = users;
    this.game = game;
    this.dead = false;
  }

  addUser(socket, callback) {
    if (!this.users.includes(socket.id)) {
      // Join to socket.io room
      socket.join(this.name, (err) => {
        if (err) {
          if (callback) callback(Error("Failed to add user to room!"));
          return;
        }

        // Join to local `users` state
        this.users.push(socket.id);
        if (callback) callback();
      });
    } else {
      if (callback) callback(Error("User already exists!"));
    }
  }

  removeUser(socket, callback) {
    if (this.users.includes(socket.id)) {
      // Remove user from `room`;
      this.users.splice(this.users.indexOf(socket.id), 1);
      if (callback) callback();
    } else {
      if (callback) callback(Error("User doesn't exists!"));
    }
  }

  emitAll(io, event, message) {
    io.to(this.name).emit(event, message);
  }

  emitOpponent(io, socket, event, message) {
    const emitTo = this.users.find((userId) => socket.id != userId);
    io.to(emitTo).emit(event, message);
  }

  die() {
    this.dead = true;
  }
};
