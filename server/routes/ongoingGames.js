/*
  This file serves the following FRs:
  FR7 - Handle.Disconnection
  FR8 - Handle.Reconnection
  FR9 - Spectate
  FR12 - Board.Create
*/

const express = require("express");
const User = require("../models/OngoingGames");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const OngoingGames = require("../models/OngoingGames");
const { getTime } = require("../data");

const router = express.Router();
const jsonParser = bodyParser.json();

router.get("/byPlayer", jsonParser, async (req, res) => {
  const { player } = req.query;
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
router.get("/byGameId", jsonParser, async (req, res) => {
  const { gameId } = req.query;
  let game = await OngoingGames.findOne({ room: gameId });
  if (game) {
    const time = getTime(gameId);
    game = {
      ...game._doc,
      player1Time: time.player1,
      player2Time: time.player2,
    };
    res.status(200);
    res.send(game);
  } else {
    res.status(404);
    res.send({ message: "No ongoing game found" });
  }
});
module.exports = router;
