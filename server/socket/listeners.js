const Queue = require("../models/Queue");
const {
  findGameInQueue,
  addToOngoingGames,
  handleGameJoin,
  handleCreateGame,
  findPrivateGame,
  updateOngoingGames,
} = require("./events/gameUtils");
const { emitToRoom } = require("./emittors");
const { handleDisconnection } = require("./events/gameUtils");
const { handleUserConnect } = require("./user/userSocketHandler");
const listen = (io, socket) => {
  socket.on("user connect", (userId) => {
    handleUserConnect(userId, socket, io);
  });

  // Logic for handling a new game join
  socket.on("join quick play", async (gameInfo) => {
    const { mode, type, timeControl } = gameInfo;
    const game = await findGameInQueue(mode, timeControl, type);
    if (game) {
      const newGameInfo = {
        ...gameInfo,
        side: game.side === "w" ? "b" : "w",
      };
      handleGameJoin(io, socket, game, newGameInfo);
    } else {
      handleCreateGame(socket, gameInfo);
    }
  });

  socket.on("join private game", async (gameInfo) => {
    const { userId, mode, side, type, timeControl, room } = gameInfo;
    // INSTEAD FIND GAME ROOM IN QUEUE
    const game = await findPrivateGame(room);
    if (game) {
      handleGameJoin(io, socket, game, gameInfo);
    } else {
      // ERROR: GAME NOT FOUND
      socket.emit("join fail", "Game not found");
    }
  });

  socket.on("game start", (gameId) => {
    // Logic for starting the game
  });

  socket.on("move piece", (move) => {
    const { gameRoom, input, fen } = move;
    updateOngoingGames({ room: gameRoom }, { $push: { fen: fen } });
    emitToRoom(socket, gameRoom, "oppMove", input);
  });

  socket.on("game end", () => {
    // Logic for ending the game
  });

  socket.on("create room", (roomId) => {
    socket.join(roomId);
    io.emit("room created", roomId);
  });

  socket.on("join room", (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit("player joined", socket.id);
  });

  socket.on("leave room", (roomId) => {
    socket.leave(roomId);
    io.to(roomId).emit("player left", socket.id);
  });

  socket.on("disconnecting", () => {
    const rooms = Object.keys(socket.rooms);
    rooms.forEach((roomId) => {
      io.to(roomId).emit("player disconnected", socket.id);
    });
  });

  socket.on("disconnect", async () => {
    await handleDisconnection(socket.id, io);
  });
};

module.exports = listen;
