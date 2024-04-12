/*
  This file serves the following FRs:
  FR7 - Handle.Disconnection
  FR8 - Handle.Reconnection
  FR9 - Spectate
  FR12 - Board.Create
*/
const mongoose = require("mongoose");

const ongoingGamesSchema = mongoose.Schema(
  {
    player1: String,
    player2: String,
    mode: String,
    timeControl: String,
    room: String,
    fen: [String],
  },
  { collection: "ongoingGames" }
);

const OngoingGames = new mongoose.model("OngoingGames", ongoingGamesSchema);

module.exports = OngoingGames;
