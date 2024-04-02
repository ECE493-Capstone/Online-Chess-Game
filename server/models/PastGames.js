const mongoose = require("mongoose");

const pastGamesSchema = mongoose.Schema(
  // This model will be to display all the moves of a given game.
  {
    player1: String,
    player2: String,
    mode: String,
    timeControl: String,
    room: String,
    fen: [String], // stores the moves (I guess?) Still discussing how this will be implemented. Don't need it for now.
    winner: String, // display the name of the winner. Null of tie
  },
  { collection: "pastGames" }
);

const PastGames = new mongoose.model("PastGames", pastGamesSchema);

module.exports = PastGames;
