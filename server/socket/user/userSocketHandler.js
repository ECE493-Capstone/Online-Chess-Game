const { addSocket, getUserActiveGame } = require("../../data");
const Socket = require("../../models/Socket");
const handleUserConnect = async (userId, socketId) => {
  const userSocket = new Socket({
    userId: userId,
    socketId: socketId,
    rooms: [],
  });
  const result = await userSocket.save();
};

const handleUserDisconnect = async (socketId) => {
  const result = await Socket.findOneAndUpdate(
    { socketId: socketId },
    { $set: { socketId: null } },
    { upsert: true }
  );
};

const findExistingSocket = async (query) => {
  const result = await Socket.findOne(query);
  return result;
};

const handleUserReconnect = async (userId, socket) => {
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
  console.log("RECONNECTED");
  const activeGame = getUserActiveGame(userId);
  addSocket(userId, socket.id);
  socket.join(activeGame);
};

module.exports = {
  findExistingSocket,
  handleUserConnect,
  handleUserDisconnect,
  handleUserReconnect,
};
