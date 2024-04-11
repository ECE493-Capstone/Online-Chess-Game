const PastGames = require("../server/models/PastGames");

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

    console.log("Saving this game: ", JSON.stringify(newPastGame));
    await newPastGame.save();
};

module.exports = { addPastGame };