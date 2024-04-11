const {
  addSocket,
  getUserActiveGame,
  disconnectPlayer,
  getPlayerFromRoom,
  getActiveUsers,
  getActiveGames,
  removeSocketId,
} = require("../../data");
const Socket = require("../../models/Socket");
const handleUserConnect = async (userId, socket, io) => {
  // const userSocket = new Socket({
  //   userId: userId,
  //   socketId: socketId,
  //   rooms: [],
  // });
  // const result = await userSocket.save();
  if (!getUserActiveGame(userId)) {
    return;
  }
  console.log("ACTIVE GAMES", getActiveGames());
  handleUserReconnect(userId, socket, io);
};

const handleUserDisconnect = async (socketId, io) => {
  // const result = await Socket.findOneAndUpdate(
  //   { socketId: socketId },
  //   { $set: { socketId: null } },
  //   { upsert: true }
  // );
  // ON DISCONNECT:
  // - remove socketId from activeUsers (set it to null)
  disconnectPlayer(socketId, io);
};

const findExistingSocket = async (query) => {
  const result = await Socket.findOne(query);
  return result;
};

const handleUserReconnect = async (userId, socket, io) => {
  const activeGame = getUserActiveGame(userId);
  addSocket(userId, socket.id);
  socket.join(activeGame);
  const player = getPlayerFromRoom(activeGame, userId);
  const activeUsers = getActiveUsers();
  if (activeUsers[userId].socket.length > 1) {
    console.log(activeUsers[userId].socket);
    let toBeDisconnected = activeUsers[userId].socket[0];
    removeSocketId(userId, activeUsers[userId].socket[0]);
    io.to(toBeDisconnected).emit("disconnect socket");
  }
  if (player && activeUsers[userId].socket.length == 1) {
    console.log("EMITTING", activeUsers[player].socket);
    io.to(activeUsers[player].socket).emit("opponent reconnected");
  }
};

module.exports = {
  findExistingSocket,
  handleUserConnect,
  handleUserDisconnect,
  handleUserReconnect,
};
