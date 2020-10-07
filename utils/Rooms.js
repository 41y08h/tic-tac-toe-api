class Rooms {
  constructor() {
    if (Rooms.instance == null) {
      this.rooms = [];
      Rooms.instance = this;
    }
    return Rooms.instance;
  }
  add(room, callback) {
    this.rooms.push(room);
    if (callback) callback();
  }

  remove(name, callback) {
    let removed = false;
    this.rooms.forEach((room, i) => {
      if (room.name === name) {
        this.rooms.splice(i, 1);
        removed = true;
        if (callback) callback();
      }
    });
    if (!removed) {
      if (callback) callback(Error("No such room exists!"));
    }
  }

  removeEmpty() {
    this.rooms.forEach((room, i) => {
      if (room.users.length === 0) {
        this.rooms.splice(i, 1);
      }
    });
  }

  get(name) {
    return this.rooms.find((room) => room.name === name);
  }

  getLastRoom() {
    const expectedRoom = this.rooms[this.rooms.length - 1];
    if (typeof expectedRoom != "undefined") {
      return expectedRoom;
    } else {
      return null;
    }
  }
}

const rooms = new Rooms();
Object.freeze(rooms);
module.exports = rooms;
