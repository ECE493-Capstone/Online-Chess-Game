const mongoose = require("mongoose");

const socketSchema = mongoose.Schema(
  {
    userId: String,
    socketId: String,
  },
  { collection: "sockets" }
);

const Socket = new mongoose.model("Socket", socketSchema);

module.exports = Socket;
