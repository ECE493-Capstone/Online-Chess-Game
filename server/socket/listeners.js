const Queue = require("../models/Queue");
const { findGameInQueue, addToOngoingGames } = require("./events/gameUtils");
const { createRoom } = require("./rooms/roomUtils");
const { addSocket, addActiveGame } = require("../data");
const { emitToRoom } = require("./emittors");
const { handleDisconnection } = require("./events/gameUtils");
const listen = (io, socket) => {
  // Logic for handling a new game join
  socket.on("join game", async (gameInfo) => {
    const { userId, mode, side, timeControl } = gameInfo;
    const game = await findGameInQueue(mode, timeControl, side);
    if (game) {
      // join existing game
      // delete from queue
      // add to active game
      // join a room
      socket.join(game.room);
      addToOngoingGames({
        player1: game.side === "w" ? game.userId : userId,
        player2: game.side === "b" ? game.userId : userId,
        mode,
        timeControl,
        room: game.room,
        pgn: "",
      });
      addSocket(game.userId, game.socketId);
      addSocket(userId, socket.id);
      addActiveGame(game.userId, game.room);
      addActiveGame(userId, game.room);
      emitToRoom(io, game.room, "game joined", game.room);
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
    }
  });
  socket.on("game start", (gameId) => {
    // Logic for starting the game
  });

  socket.on("move piece", (move) => {
    const { gameRoom, input } = move;
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
    console.log("DISCONNEct", socket.id);
    await handleDisconnection(socket.id);
  });
};

module.exports = listen;
