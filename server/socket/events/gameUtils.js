const OngoingGames = require("../../models/OngoingGames");
const PastGames = require("../../models/PastGames");
const Queue = require("../../models/Queue");
const { addSocket, addActiveGame } = require("../../data");
const { handleUserDisconnect } = require("../user/userSocketHandler");
const { createRoom } = require("../rooms/roomUtils");
const { emitToRoom } = require("../emittors");

const findGameInQueue = async (mode, tc, type) => {
  const game = await Queue.findOne(
    { mode: mode, type: type, timeControl: tc },
    null,
    {
      sort: { joinTime: 1 },
    }
  );
  return game;
};

const findPrivateGame = async (room) => {
  const game = await Queue.findOne({ room: room }, null, {
    sort: { joinTime: 1 },
  });
  return game;
};

const handleCreateGame = async (socket, gameInfo) => {
  const { userId, mode, side, type, timeControl } = gameInfo;
  const room = createRoom();
  const newGame = new Queue({
    userId,
    mode,
    room,
    type,
    side,
    socketId: socket.id,
    timeControl,
  });
  const saveResult = await newGame.save();
  socket.join(room);
};

const handleGameJoin = (io, socket, existingGame, newGame) => {
  const { userId, mode, side, timeControl } = newGame;
  // join existing game
  // delete from queue
  // add to active game
  // join a room
  socket.join(existingGame.room);
  console.log(existingGame.side, newGame.side);
  addToOngoingGames({
    player1: existingGame.side === "w" ? existingGame.userId : userId,
    player2: existingGame.side === "b" ? existingGame.userId : userId,
    mode,
    timeControl,
    room: existingGame.room,
    pgn: "",
  });
  addSocket(existingGame.userId, existingGame.socketId);
  addSocket(userId, socket.id);
  addActiveGame(existingGame.userId, existingGame.room);
  addActiveGame(userId, existingGame.room);
  emitToRoom(io, existingGame.room, "game joined", existingGame.room);
};

const handlePrivateGameJoin = (io, socket, existingGame, userId) => {
  // join existing game
  // delete from queue
  // add to active game
  // join a room
  socket.join(existingGame.room);
  addToOngoingGames({
    player1: existingGame.side === "w" ? existingGame.userId : userId,
    player2: existingGame.side === "b" ? existingGame.userId : userId,
    mode: existingGame.mode,
    timeControl: existingGame.timeControl,
    room: existingGame.room,
    pgn: "",
  });
  addSocket(existingGame.userId, existingGame.socketId);
  addSocket(userId, socket.id);
  addActiveGame(existingGame.userId, existingGame.room);
  addActiveGame(userId, existingGame.room);
  emitToRoom(io, existingGame.room, "game joined", existingGame.room);
};

const addToOngoingGames = async (data) => {
  const newGame = new OngoingGames(data);
  await newGame.save();
};

const deleteOneFromQueue = async (query) => {
  const result = await Queue.deleteOne(query);
};

const handleDisconnection = async (socketId) => {
  await deleteOneFromQueue({ socketId });
  await handleUserDisconnect(socketId);
};

const convertOngoingGameToPastGame = async (roomId, winnerId) => {
  const gameToSave = await OngoingGames.findOne({ room: roomId });
  if (!gameToSave) {
    console.log(`Game not found for room: ${roomId}`);
    return;
  }
  const newPastGame = new PastGames({
    player1: gameToSave.player1,
    player2: gameToSave.player2,
    mode: gameToSave.mode,
    timeControl: gameToSave.timeControl,
    room: gameToSave.room,
    fen: gameToSave.fen,
    winner: winnerId ? winnerId : null,
  });
  await newPastGame.save();
  console.log(`${gameToSave.room} saved to past games`);

  await OngoingGames.deleteOne({ room: roomId });
};

const addFen = async (roomId, fen) => {
  const game = await OngoingGames.findOne({ room: roomId });
  if (game) {
    game.fen.push(fen);
    await game.save();
  } else {
    console.log("Game not found when adding fen");
  }
};

const updateFen = async (roomId, newFenArr) => {
  const game = await OngoingGames.findOne({ room: roomId });
  if (game) {
    game.fen = newFenArr;
    await game.save();
  } else {
    console.log("Game not found when updating fen");
  }
};

const popFen = async (roomId) => {
  const game = await OngoingGames.findOne({ room: roomId });
  if (game) {
    const fenRemoved = game.fen.pop();
    await game.save();
  } else {
    console.log("Game not found when popping fen");
  }
};

const getLastFen = async (roomId) => {
  const game = await OngoingGames.findOne({ room: roomId });
  const defaultFen = "RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr w kqKQ - 0 1";
  if (game) {
    return game.fen.length > 0 ? game.fen[game.fen.length - 1] : defaultFen;
  } else {
    console.log("Game not found when getting latest fen");
  }
};

module.exports = {
  addToOngoingGames,
  findGameInQueue,
  deleteOneFromQueue,
  handleDisconnection,
  findPrivateGame,
  handlePrivateGameJoin,
  handleGameJoin,
  handleCreateGame,
  convertOngoingGameToPastGame,
  addFen,
  updateFen,
  popFen,
  getLastFen,
};
