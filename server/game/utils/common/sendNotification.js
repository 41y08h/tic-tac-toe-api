const events = require("../../config/events");

function sendNotification(io, ...notifications) {
  function send(notification) {
    io.to(notification.toId).emit(events.notification, notification.text);
  }

  notifications.forEach(send);
}

module.exports = sendNotification;
