const mongoose = require("mongoose");

const ongoingGamesSchema = mongoose.Schema( // This model will be to display all the moves of a given game.
  {
    gameId: String, // the id for the game 
    black: String, // white player id
    white: String, // black player id
    moves: String, // a list of moves made by the players.

  },
  { collection: "gameDetails" }
);

const OngoingGames = new mongoose.model("GameDetails", ongoingGamesSchema);

module.exports = OngoingGames;