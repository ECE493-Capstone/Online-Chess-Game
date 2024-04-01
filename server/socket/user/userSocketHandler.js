const {
  addSocket,
  getUserActiveGame,
  removeSocket,
  getPlayerFromRoom,
  getActiveUsers,
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
    console.log("NEW USER", userId);
    return;
  }
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
  removeSocket(socketId, io);
};

const findExistingSocket = async (query) => {
  const result = await Socket.findOne(query);
  return result;
};

const handleUserReconnect = async (userId, socket, io) => {
  // const result = await Socket.findOneAndUpdate(
  //   { userId: userId },
  //   { $set: { socketId: socket.id } },
  //   { upsert: true }
  // ).then((res) => {
  //   if (res) {
  //     res.rooms.forEach((room) => {
  //       socket.join(room);
  //     });
  //   } else {
  //     console.log("OOP");
  //   }
  // });
  // CHECK IF USER IS NEW
  // IF NOT, RECONNECT
  console.log("RECONNECTED", userId, socket.id);
  const activeGame = getUserActiveGame(userId);
  addSocket(userId, socket.id);
  socket.join(activeGame);
  const player = getPlayerFromRoom(activeGame, userId);
  const activeUsers = getActiveUsers();
  if (player && activeUsers[player].socket) {
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
