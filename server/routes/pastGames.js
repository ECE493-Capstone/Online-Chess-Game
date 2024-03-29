const express = require("express");
const bodyParser = require("body-parser");
const OngoingGames = require("../models/PastGames");

const router = express.Router();
const jsonParser = bodyParser.json();

router.get("/byPlayer", jsonParser, async (req, res) => {
  const { player } = req.query;
  console.log(req.query);
//   player = "66048fbaa9cde3a65f01e1d6";
  try {
    const games = await OngoingGames.find({ $or: [{ black: player }, { white: player }] });
    if (games.length > 0) {
      console.log("Found games for the player. Sending games: " + games);
      res.status(200);
      res.send(games);
    } else {
      console.log("404 status: No games found for the player.");
      res.status(404);
      res.send({ message: "No past games found for the player." });
    }
  } catch (error) {
    console.error("Error retrieving games:", error);
    res.status(500);
    res.send({ message: "Internal server error" });
  }
});

router.get("/byPlayerOpponent", jsonParser, async (req, res) => {
  const { player, opponent } = req.query;
  console.log("THIS IS THE PLAYER: " + JSON.stringify(player));
  console.log("THIS IS THE OPPONENT: " + JSON.stringify(opponent));
  try {
    const games = await OngoingGames.find({ 
      $or: [
        { $and: [{ black: player }, { white: opponent }] }, // player as black, opponent as white
        { $and: [{ white: player }, { black: opponent }] }  // player as white, opponent as black
      ]
    });

    if (games.length > 0) {
      console.log("Found games where player vs opponent. Sending games: " + games);
      res.status(200).send(games);
    } else {
      console.log("404 status: No games found for the player vs opponent.");
      res.status(404).send({ message: "No past games found for the player against the opponent." });
    }
  } catch (error) {
    console.error("Error retrieving games:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;