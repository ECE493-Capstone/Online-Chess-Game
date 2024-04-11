const Queue = require("../server/models/Queue");
const { createRoom } = require("../server/socket/rooms/roomUtils");

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

const findPrivateGame = async (room) => {
  const game = await Queue.findOne({ room: room }, null, {
    sort: { joinTime: 1 },
  });
  return game;
};

const handleGameJoin = (io, socket, existingGame, newGame) => {
  const { userId, mode, side, timeControl } = newGame;
  // join existing game
  // delete from queue
  // add to active game
  // join a room
  socket.join(existingGame.room);
  addToOngoingGames({
    player1: existingGame.side === "w" ? existingGame.userId : userId,
    player2: existingGame.side === "b" ? existingGame.userId : userId,
    mode,
    timeControl,
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

  module.exports = {
    handleCreateGame,
    findPrivateGame,
  };