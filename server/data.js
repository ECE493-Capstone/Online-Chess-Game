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

const addActiveGame = (userId, roomId) => {
  activeUsers[userId].activeGame = roomId;
};

const removeUser = (userId) => {
  delete activeUsers[userId];
};

const addGame = (gameId, userId1, userId2) => {
  activeGames[gameId] = {
    player1: userId1,
    player2: userId2,
  };
};

const getUserActiveGame = (userId) => {
  return activeUsers[userId].activeGame;
};

const isExistingActivePlayer = (userId) => {
  return activeUsers[userId];
};

module.exports = {
  addSocket,
  addActiveGame,
  isExistingActivePlayer,
  getUserActiveGame,
};
