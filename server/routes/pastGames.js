const express = require("express");
const bodyParser = require("body-parser");
const OngoingGames = require("../models/PastGames");

const router = express.Router();
const jsonParser = bodyParser.json();

router.get("/byPlayer", jsonParser, async (req, res) => {
  const { player } = req.query;
  console.log(req.query);
  try {
    const games = await OngoingGames.find({ $or: [{ black: player }, { white: player }] });
    if (games.length > 0) {
      console.log("Found games for the player. Sending games.");
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

module.exports = router;