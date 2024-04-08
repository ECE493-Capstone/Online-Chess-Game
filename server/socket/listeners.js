const Queue = require("../models/Queue");
const {
  findGameInQueue,
  addToOngoingGames,
  handleGameJoin,
  handleCreateGame,
  findPrivateGame,
  convertOngoingGameToPastGame,
  addFen,
  popFen,
  getLastFen,
} = require("./events/gameUtils");
const { emitToRoom } = require("./emittors");
const { handleDisconnection } = require("./events/gameUtils");
const { handleUserConnect } = require("./user/userSocketHandler");
const { addVote, getMajorityVote, clearVotes } = require("../data");
const {
  updateActiveGame,
  getTime,
  getInterval,
  setIntervalVal,
  clearIntervalVal,
} = require("../data");
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

  socket.on("join room", (gameId) => {
    socket.join(gameId);
  });
  socket.on("move piece", async (move) => {
    const { gameRoom, input, fen, infoIfRandomDuck, increment } = move;
    console.log(`[FEN after move]: ${fen}`);
    await addFen(gameRoom, fen);
    updateActiveGame(gameRoom, increment);
    emitToRoom(socket, gameRoom, "oppMove", input);
    emitToRoom(socket, gameRoom, "spectatorMove", fen);
    const broadcastVotingEvent = (io, gameRoom, infoIfRandomDuck) => {
      let timeLeft = 10000; // 10 seconds
      io.to(gameRoom).emit("voteStart", timeLeft / 1000);
      const voteInterval = setInterval(async () => {
        timeLeft -= 1000;
        if (timeLeft <= 0) {
          clearInterval(voteInterval);
          const majorityVote = getMajorityVote(gameRoom);
          clearVotes(gameRoom);

          if (majorityVote !== null) {
            console.log(`Majority vote: ${majorityVote.square}`);
            io.to(gameRoom).emit("voteEnd", majorityVote.square);
            await addFen(gameRoom, majorityVote.fen);
            console.log(`[FEN after vote]: ${majorityVote.fen}`);
          } else {
            console.log(`Randomized vote: ${infoIfRandomDuck.duckSquare}`);
            io.to(gameRoom).emit("voteEnd", infoIfRandomDuck.duckSquare);
            await addFen(gameRoom, infoIfRandomDuck.fenAfterRandomDuck);
            console.log(
              `[FEN after vote]: ${infoIfRandomDuck.fenAfterRandomDuck}`
            );
          }
          return;
        }
        io.to(gameRoom).emit("voteTime", timeLeft / 1000);
      }, 1000);
    };
    if (infoIfRandomDuck !== null) {
      // !== null if game mode is POWER_UP_DUCK
      broadcastVotingEvent(io, gameRoom, infoIfRandomDuck);
    }
  });

  socket.on("cast vote", (voteInfo) => {
    addVote(voteInfo);
  });

  socket.on("game end", async (gameInfo) => {
    // exactly the same as resign
    const { gameRoom, winnerId } = gameInfo;
    await convertOngoingGameToPastGame(gameRoom, winnerId);
    io.to(gameRoom).emit("game result", winnerId);
  });

  socket.on("create room", (roomId) => {
    socket.join(roomId);
    io.emit("room created", roomId);
  });

  socket.on("join room", (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit("player joined", socket.id);
  });

  socket.on("start timer", ({ gameRoom }) => {
    if (getInterval(gameRoom)) {
      return;
    }
    const interval = setInterval(() => {
      let time = getTime(gameRoom);
      let isWhite = time.side === "player1" ? true : false;
      let event = isWhite ? "whiteTime" : "blackTime";
      let playerTime = isWhite ? time.player1 : time.player2;
      if (playerTime < -999.99) {
        clearIntervalVal(gameRoom);
        return;
      }
      io.to(gameRoom).emit(event, playerTime);
    }, 1000);
    setIntervalVal(gameRoom, interval);
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

  socket.on("resign", async (gameInfo) => {
    const { gameRoom, winnerId } = gameInfo;
    await convertOngoingGameToPastGame(gameRoom, winnerId);
    io.to(gameRoom).emit("game result", winnerId);
  });

  socket.on("draw request", (info) => {
    const { gameRoom } = info;
    emitToRoom(socket, gameRoom, "oppDrawRequest");
  });

  socket.on("reply draw request", async (info) => {
    const { gameRoom, accepted } = info;
    if (accepted) {
      await convertOngoingGameToPastGame(gameRoom, null);
      io.to(gameRoom).emit("game result", null);
    } else {
      emitToRoom(socket, gameRoom, "drawRejected");
    }
  });

  socket.on("undo request", (info) => {
    const { gameRoom } = info;
    emitToRoom(socket, gameRoom, "oppUndoRequest");
  });

  socket.on("reply undo request", async (info) => {
    const { gameRoom, accepted } = info;
    if (accepted) {
      await popFen(gameRoom);
      const lastFen = await getLastFen(gameRoom);
      io.to(gameRoom).emit("undoBoard", lastFen);
      console.log(`$Fen for undo: ${lastFen}`);
    } else {
      emitToRoom(socket, gameRoom, "undoRejected");
    }
  });
};

module.exports = listen;
