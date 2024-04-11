const express = require("express");
const bodyParser = require("body-parser");
const pastGames = require("../models/PastGames");

const router = express.Router();
const jsonParser = bodyParser.json();

router.get("/h2h", jsonParser, async (req, res) => {
  const { player1, player2 } = req.query;
  try {
    const games = await pastGames.find({
      $or: [
        { $and: [{ player1: player1 }, { player2: player2 }] },
        { $and: [{ player2: player1 }, { player1: player2 }] },
      ],
    });

    if (games.length > 0) {
      // find the number of games won by player1
      const player1Wins = games.filter(
        (game) => game.winner === player1
      ).length;
      const player2Wins = games.filter(
        (game) => game.winner === player2
      ).length;
      res.send({
        [player1]: player1Wins,
        [player2]: player2Wins,
      });
    } else {
      res.send({
        [player1]: 0,
        [player2]: 0,
      });
    }
  } catch (error) {
    console.error("Error retrieving games:", error);
    res.status(500);
    res.send({ message: "Internal server error" });
  }
});

router.get("/byPlayer", jsonParser, async (req, res) => {
  const { player } = req.query;
  try {
    const games = await pastGames.find({
      $or: [{ player1: player }, { player2: player }],
    });
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

router.get("/byId", jsonParser, async (req, res) => {
  const { gameId } = req.query;
  try {
    const game = await pastGames.findOne({ room: gameId });
    if (game) {
      res.status(200);
      res.send(game);
    } else {
      res.status(404);
      res.send({ message: "Game not found." });
    }
  } catch (error) {
    console.error("Error retrieving game:", error);
    res.status(500);
    res.send({ message: "Internal server error" });
  }
});

module.exports = router;
