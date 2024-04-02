const mongoose = require("mongoose");

const pastGamesSchema = mongoose.Schema(
  // This model will be to display all the moves of a given game.
  {
    gameId: String, // the id for the game
    black: String, // black player id
    white: String, // white player id
    moves: String, // a list of moves made by the players. Chess Notation
    mode: String,
    timeControl: String,
    room: String,
    fen: [String],
    winner: String, // display the name of the winner. Null of tie
  },
  { collection: "pastGames" }
);

const PastGames = new mongoose.model("PastGames", pastGamesSchema);

module.exports = PastGames;
