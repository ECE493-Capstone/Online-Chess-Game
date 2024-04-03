const express = require("express");
const bodyParser = require("body-parser");
const pastGames = require("../models/PastGames");

const router = express.Router();
const jsonParser = bodyParser.json();

router.get("/h2h", jsonParser, async (req, res) => {
  const { player1, player2 } = req.query;
  console.log(req.query);
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
module.exports = router;
