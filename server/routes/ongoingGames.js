const express = require("express");
const User = require("../models/OngoingGames");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const OngoingGames = require("../models/OngoingGames");

const router = express.Router();
const jsonParser = bodyParser.json();

router.get("/byPlayer", jsonParser, async (req, res) => {
  const { player } = req.query;
  console.log(req.query);
  const player1Game = await OngoingGames.findOne({ player1: player });
  const player2Game = await OngoingGames.findOne({ player2: player });
  if (player1Game || player2Game) {
    const game = player1Game || player2Game;
    res.status(200);
    res.send(game);
  } else {
    res.status(404);
    res.send({ message: "No ongoing game found" });
  }
});
module.exports = router;
