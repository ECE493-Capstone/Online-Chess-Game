const mongoose = require("mongoose");

const ongoingGamesSchema = mongoose.Schema(
  {
    player1: String,
    player2: String,
    mode: String,
    timeControl: String,
    room: String,
    fen: [String],
    pgn: String,
  },
  { collection: "ongoingGames" }
);

const OngoingGames = new mongoose.model("OngoingGames", ongoingGamesSchema);

module.exports = OngoingGames;
