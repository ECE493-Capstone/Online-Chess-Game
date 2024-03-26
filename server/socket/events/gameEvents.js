const Queue = require("../../models/Queue");
const { findGameInQueue, addToOngoingGames } = require("./gameUtils");
const { createRoom } = require("../rooms/roomUtils");
const handleGameEvents = (io, socket) => {
  socket.on("join game", async (gameInfo) => {
    const { userId, mode, side, timeControl } = gameInfo;
    const game = await findGameInQueue(mode, timeControl, side);
    if (game) {
      // join existing game
      // delete from queue
      // add to active game
      // join a room
      socket.join(game.room);
      console.log(io.sockets.adapter.rooms);
      addToOngoingGames({
        player1: game.side === "w" ? game.userId : userId,
        player2: game.side === "b" ? game.userId : userId,
        mode,
        timeControl,
        room: game.room,
        pgn: "",
      });
      io.to(game.room).emit("game joined", game.room);
    } else {
      // create new game
      const room = createRoom();
      const newGame = new Queue({
        userId,
        mode,
        room,
        side,
        socketId: socket.id,
        timeControl,
      });
      const saveResult = await newGame.save();
      socket.join(room);
      // console.log(`SaveResult: ${saveResult}`);
    }
  });
  socket.on("game start", (gameId) => {
    // Logic for starting the game
  });

  socket.on("move piece", (move) => {
    const { gameRoom, input } = move;
    io.to(gameRoom).emit("move", input);
  });

  socket.on("game end", () => {
    // Logic for ending the game
  });
};
module.exports = handleGameEvents;
