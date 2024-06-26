/*
  This file serves the following FRs:
  FR5 - Queue.Enter
  FR6 - Queue.Exit
*/
const mongoose = require("mongoose");

const queueSchema = mongoose.Schema(
  {
    userId: String,
    mode: String,
    timeControl: String,
    room: String,
    side: String,
    type: String,
    socketId: String,
    joinTime: { type: Date, default: Date.now },
  },
  { collection: "queue" }
);

const Queue = new mongoose.model("Queue", queueSchema);

module.exports = Queue;
