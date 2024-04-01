const OngoingGames = require("../../models/OngoingGames");
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

const deleteOngoingGames = async (query) => {
  const result = await OngoingGames.deleteMany(query);
};

const handleDisconnection = async (socketId) => {
  await deleteOneFromQueue({ socketId });
  await handleUserDisconnect(socketId);
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
};
