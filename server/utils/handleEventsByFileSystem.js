const fs = require("fs");

/**
 * @param String - Filename with extension i.e {filename}.{extension}
 * @returns String - Filename without extension i.e {filename}~~.{extension}~~
 * */
function removeExtensionFromFilename(filename) {
  const filenameFollowedByExtension = filename.split(".");
  const withoutExtension = filenameFollowedByExtension[0];
  return withoutExtension;
}

/**
 * @param `socket`
 * @param `io`
 * @returns `function` - that takes event filename and attaches it to given socket
 * */
function getEventHandlerMapper(socket, io) {
  return function (eventFilename) {
    const event = removeExtensionFromFilename(eventFilename);

    const handlerPath = path.join(__dirname, "../events/", eventFilename);
    const createEventHandler = require(handlerPath);
    const handleEvent = createEventHandler(socket, io);

    socket.on(event, handleEvent);
  };
}

/**
 * Implements file system event handling in socket.io
 * @param `socket`
 * @param `io`
 */
function handleEventsByFileSystem(socket, io, pathToEventsDirectory) {
  const filenamesInDirectory = fs.readdirSync(pathToEventsDirectory);

  // Remove module which is made to be called when the socket joins
  const eventFilenames = filenamesInDirectory.filter(
    (filename) => filename !== "join.js"
  );
  const mapEventHandlerToSocket = getEventHandlerMapper(socket, io);
  eventFilenames.forEach((filename) => {
    mapEventHandlerToSocket(filename);
  });
}

module.exports = handleEventsByFileSystem;
