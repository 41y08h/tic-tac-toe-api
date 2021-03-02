const onJoin = require("./join");
const onPlay = require("./play");
const onMessage = require("./message");
const onEndCall = require("./endCall");
const onRejectCall = require("./rejectCall");
const onAnswerCall = require("./answerCall");
const onCallPeer = require("./callPeer");
const onDisconnect = require("./disconnect");
const events = require("../config/events");

async function registerEvents(socket, io) {
  // onJoin is not an event but consists of things
  // required to do when a user connects
  onJoin(socket, io);

  socket.on(events.play, onPlay(socket, io));
  socket.on(events.message, onMessage(socket, io));
  socket.on(events.callPeer, onCallPeer(socket, io));
  socket.on(events.endCall, onEndCall(socket, io));
  socket.on(events.rejectCall, onRejectCall(socket, io));
  socket.on(events.answerCall, onAnswerCall(socket, io));
  socket.on(events.disconnect, onDisconnect(socket, io));
}

module.exports = registerEvents;
