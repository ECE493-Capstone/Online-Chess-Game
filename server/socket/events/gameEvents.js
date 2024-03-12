const Queue = require("../../models/Queue");
const { addToOngoingGames } = require("./gameUtils");
const {
  findGameInQueue,
  addToQueue,
  deleteUserFromQueue,
} = require("./queueUtils");
const { createRoom } = require("../rooms/roomUtils");
const { addSocketConnection } = require("./socketUtils");
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
      const data = {
        player1: game.side === "w" ? game.userId : userId,
        player2: game.side === "b" ? game.userId : userId,
        mode,
        timeControl,
        room: game.room,
        pgn: "",
      };
      addToOngoingGames(data);
      deleteUserFromQueue(game.userId);
      io.to(game.room).emit("game joined", data);
    } else {
      // create new game
      const room = createRoom();
      addToQueue({
        userId,
        mode,
        room,
        side,
        socketId: socket.id,
        timeControl,
      });
      addSocketConnection({ userId, socketId: socket.id });
      socket.join(room);
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
