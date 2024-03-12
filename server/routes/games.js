const express = require("express");
const OngoingGames = require("../models/OngoingGames");
const bodyParser = require("body-parser");

const router = express.Router();
const jsonParser = bodyParser.json();

router.post("/", jsonParser, async (req, res) => {
  const { userId } = req.body;
  const gameAsPlayer1 = await OngoingGames.findOne({ player1: userId });
  const gameAsPlayer2 = await OngoingGames.findOne({ player2: userId });
  const game = gameAsPlayer1 || gameAsPlayer2;
  if (game) {
    res.status(200);
    res.send({ game, message: "in active game" });
  } else {
    res.status(200);
    res.send({ message: "no active games" });
  }
});

module.exports = router;
