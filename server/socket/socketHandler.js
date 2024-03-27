const { Server } = require("socket.io");
const listen = require("./listeners");

const handleSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    listen(io, socket);
  });
};
module.exports = handleSocket;
