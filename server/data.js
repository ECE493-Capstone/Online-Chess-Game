const OngoingGames = require("./models/OngoingGames");

const activeUsers = {};
const activeGames = {};

const addSocket = (userId, socketId) => {
  if (activeUsers[userId]) {
    activeUsers[userId].socket = socketId;
  } else {
    activeUsers[userId] = {
      activeGame: null,
      socket: socketId,
    };
  }
};

const resetUser = (userId) => {
  activeUsers[userId] = {
    activeGame: null,
    socket: null,
  };
};

const getActiveUsers = () => {
  return activeUsers;
};

const getActiveGames = () => {
  return activeGames;
};

const getPlayerFromRoom = (roomId, notUser = null) => {
  return Object.keys(activeUsers).find((user) => {
    console.log(
      "USER",
      user,
      notUser,
      user.activeGame === roomId,
      activeUsers[user].activeGame,
      roomId
    );
    return activeUsers[user].activeGame === roomId && user !== notUser;
  });
};

const removeSocket = (socketId, io) => {
  Object.keys(activeUsers).forEach((user) => {
    if (activeUsers[user].socket === socketId) {
      activeUsers[user].socket = null;
      const player = getPlayerFromRoom(activeUsers[user].activeGame, user);
      if (player && activeUsers[player].socket) {
        console.log("EMITTING", activeUsers[player].socket);
        io.to(activeUsers[player].socket).emit("opponent disconnected");
      } else {
        removeUser(user);
        removeUser(player);
      }
      setTimeout(async () => {
        if (!activeUsers[user]?.socket) {
          removeUser(user);
          console.log(
            `User ${user} disconnected and was removed from userConnections`
          );
          const player = getPlayerFromRoom(user.activeGame);
          console.log(player);
          if (player) {
            console.log(player);
            io.to(activeUsers[player].socket).emit("opponent abandoned");
          }
          const result = await OngoingGames.deleteMany({
            $or: [{ player1: user }, { player2: user }],
          });
          console.log(result);
        }
      }, 45000);
    }
  });
};

const addActiveGame = (userId, roomId) => {
  activeUsers[userId].activeGame = roomId;
};

const removeUser = (userId) => {
  if (userId) delete activeUsers[userId];
};

const getUserActiveGame = (userId) => {
  return activeUsers[userId]?.activeGame;
};

const isExistingActivePlayer = (userId) => {
  return activeUsers[userId];
};

module.exports = {
  addSocket,
  addActiveGame,
  isExistingActivePlayer,
  getUserActiveGame,
  getPlayerFromRoom,
  removeSocket,
  getActiveGames,
  getActiveUsers,
  resetUser,
};
