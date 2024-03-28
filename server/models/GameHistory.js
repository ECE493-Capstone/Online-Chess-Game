const mongoose = require("mongoose");

const ongoingGamesSchema = mongoose.Schema( // idk what fields to include in here
  {
    player1: String,
    player2: String,
    mode: String,
    timeControl: String,
    room: String,
    pgn: String,
    tie: Boolean, // true of there's a tie, false otherwise
    winner: String, // display the name of the winner. Null of tie
  },
  { collection: "gameHistory" }
);

const OngoingGames = new mongoose.model("GameHistory", ongoingGamesSchema);

module.exports = OngoingGames;