const OngoingGames = require("../server/models/OngoingGames");
const PastGames = require("../server/models/PastGames");
const Queue = require("../server/models/Queue");

const addPastGame = async (roomId, white, black, mode, timeControl, room, fen, winner) => {

    const newPastGame = new PastGames({
      gameId: roomId,
      player1: white,
      player2: black,
      mode: mode,
      timeControl: timeControl,
      room: room,
      fen: fen,
      winner: winner,
    });
    await newPastGame.save();
};

module.exports = { addPastGame };