const OngoingGames = require("../../models/OngoingGames");
const PastGames = require("../../models/PastGames");
const Queue = require("../../models/Queue");
const {
  addSocket,
  addActiveGame,
  resetUser,
  initActiveGame,
} = require("../../data");
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

const removePlayerFromQueue = async (userId) => {
  const result = await Queue.deleteOne({ userId });
  return result;
};

const findPrivateGame = async (room) => {
  const game = await Queue.findOne({ room: room });
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
  return room;
};

const handleGameJoin = (io, socket, existingGame, joiningUserId) => {
  // join existing game
  // delete from queue
  // add to active game
  // join a room
  socket.join(existingGame.room);
  addToOngoingGames({
    player1: existingGame.side === "w" ? existingGame.userId : joiningUserId,
    player2: existingGame.side === "b" ? existingGame.userId : joiningUserId,
    mode: existingGame.mode,
    timeControl: existingGame.timeControl,
    room: existingGame.room,
    fen: [],
  });
  addSocket(existingGame.userId, existingGame.socketId);
  addSocket(joiningUserId, socket.id);
  addActiveGame(existingGame.userId, existingGame.room);
  addActiveGame(joiningUserId, existingGame.room);
  removePlayerFromQueue(existingGame.userId);
  emitToRoom(io, existingGame.room, "game joined", existingGame.room);
  initActiveGame(existingGame.room, timeControlToMs(existingGame.timeControl));
};

const timeControlToMs = (timeControl) => {
  const [minutes, seconds] = timeControl.split("+");
  return parseInt(minutes) * 60000;
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
    fen: [],
  });
  addSocket(existingGame.userId, existingGame.socketId);
  addSocket(userId, socket.id);
  addActiveGame(existingGame.userId, existingGame.room);
  addActiveGame(userId, existingGame.room);
  emitToRoom(io, existingGame.room, "game joined", existingGame.room);
  initActiveGame(existingGame.room, timeControlToMs(timeControl));
};

const addToOngoingGames = async (data) => {
  const newGame = new OngoingGames(data);
  await newGame.save();
};

const updateOngoingGames = async (query, action) => {
  const result = await OngoingGames.findOneAndUpdate(query, action);
};

const deleteOneFromQueue = async (query) => {
  const result = await Queue.deleteOne(query);
};

const deleteOngoingGames = async (query) => {
  const result = await OngoingGames.deleteMany(query);
};

const handleDisconnection = async (socketId, io) => {
  await deleteOneFromQueue({ socketId });
  await handleUserDisconnect(socketId, io);
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
  deleteOngoingGames,
  handleDisconnection,
  findPrivateGame,
  handlePrivateGameJoin,
  handleGameJoin,
  handleCreateGame,
  updateOngoingGames,
  addFen,
  updateFen,
  popFen,
  getLastFen,
  removePlayerFromQueue,
};
