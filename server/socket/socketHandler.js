const { Server } = require("socket.io");
const gameEvents = require("./events/gameEvents");
const roomHandler = require("./rooms/roomHandler");
const { handleDisconnection } = require("./events/socketUtils");

const handleSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");
    // console.log(socket.id);
    gameEvents(io, socket);
    roomHandler(io, socket);

    socket.on("disconnect", async () => {
      console.log("DISCONNE");
      await handleDisconnection(socket.id);
    });
  });
};
module.exports = handleSocket;
