const OngoingGames = require("./models/OngoingGames");
const PastGames = require("./models/PastGames");

const activeUsers = {};
const activeGames = {};

const addSocket = (userId, socketId) => {
  if (activeUsers[userId]) {
    activeUsers[userId].socket.push(socketId);
  } else {
    activeUsers[userId] = {
      activeGame: null,
      socket: [socketId],
      timeout: null,
    };
  }
};

const removeSocketId = (userId, socketId) => {
  if (activeUsers[userId]) {
    activeUsers[userId].socket = activeUsers[userId].socket.filter(
      (socket) => socket !== socketId
    );
  }
};
const initActiveGame = (roomId, time) => {
  activeGames[roomId] = {
    timers: {
      player1: time,
      player2: time,
    },
    currentPlayer: "player1",
    lastTime: Date.now(),
    interval: null,
  };
};

const updateActiveGame = (roomId, increment = 0) => {
  activeGames[roomId].timers[activeGames[roomId].currentPlayer] =
    activeGames[roomId].timers[activeGames[roomId].currentPlayer] -
    (Date.now() - activeGames[roomId].lastTime) +
    increment;
  activeGames[roomId].lastTime = Date.now();
  activeGames[roomId].currentPlayer =
    activeGames[roomId].currentPlayer === "player1" ? "player2" : "player1";
};

const getTime = (roomId) => {
  return {
    player1:
      activeGames[roomId].currentPlayer === "player1"
        ? activeGames[roomId].timers.player1 -
          Date.now() +
          activeGames[roomId].lastTime
        : activeGames[roomId].timers.player1,
    player2:
      activeGames[roomId].currentPlayer === "player2"
        ? activeGames[roomId].timers.player2 -
          Date.now() +
          activeGames[roomId].lastTime
        : activeGames[roomId].timers.player2,
    side: activeGames[roomId].currentPlayer,
  };
};

const getInterval = (roomId) => {
  return activeGames[roomId].interval;
};

const setIntervalVal = (roomId, interval) => {
  activeGames[roomId].interval = interval;
};

const clearIntervalVal = (roomId) => {
  activeGames[roomId] && clearInterval(activeGames[roomId].interval);
};

const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

const resetUser = (userId) => {
  activeUsers[userId] = {
    activeGame: null,
    socket: [],
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
    return activeUsers[user].activeGame === roomId && user !== notUser;
  });
};

const userHasSocket = (userId, socketId) => {
  return activeUsers[userId].socket.includes(socketId);
};

const isPlayerActive = (player) => {
  return player && activeUsers[player]?.socket.length > 0;
};

const endGame = (roomId, userId, oppId) => {
  clearIntervalVal(roomId);
  removeUser(userId);
  removeUser(oppId);
};

const findUserBySocket = (socketId) => {
  let userIds = null;
  userIds = Object.keys(activeUsers).filter((user) =>
    activeUsers[user].socket.includes(socketId)
  );
  return userIds && userIds[0] ? userIds[0] : null;
};

const disconnectPlayer = (socketId, io) => {
  Object.keys(activeUsers).forEach(async (userId) => {
    if (userHasSocket(userId, socketId)) {
      removeSocketId(userId, socketId);
      if (isPlayerActive(userId, socketId)) {
        return;
      }
      const player = getPlayerFromRoom(activeUsers[userId].activeGame, userId);
      if (isPlayerActive(player, socketId)) {
        console.log("PLAYER ABANDONED");
      } else {
        clearTimeout(activeUsers[player]);
        console.log("ALL PLAYERS ABANDONED");
        clearIntervalVal(activeUsers[player].activeGame);
        const result = await OngoingGames.deleteMany({
          $or: [{ player1: userId }, { player2: userId }],
        });
        io.to(activeUsers[userId].activeGame).emit("all abandon");
        io.to(activeUsers[userId].activeGame).emit("game result", null);
        return;
      }
      activeUsers[userId].timeout = setTimeout(async () => {
        if (!isPlayerActive(userId)) {
          endGame(activeUsers[userId].activeGame, userId, player);
          io.to(activeUsers[userId]?.activeGame).emit("game result", null);
          clearIntervalVal(activeUsers[player].activeGame);
          convertOngoingGameToPastGame(
            activeUsers[userId].activeGame,
            player
          ).then(async () => {
            const result = await OngoingGames.deleteMany({
              $or: [{ player1: userId }, { player2: userId }],
            });
          });
          return;
        }
      }, 45000);
    }
  });
};
// const removeSocket = (socketId, io) => {
//   Object.keys(activeUsers).forEach((user) => {
//     if (activeUsers[user].socket === socketId) {
//       activeUsers[user].socket = null;
//       const player = getPlayerFromRoom(activeUsers[user].activeGame, user);
//       if (player && activeUsers[player].socket) {
//         io.to(activeUsers[player].socket).emit("opponent disconnected");
//       } else {
//         clearIntervalVal(activeUsers[user].activeGame);
//         removeUser(user);
//         removeUser(player);
//       }
//       setTimeout(async () => {
//         if (!activeUsers[user]?.socket) {
//           removeUser(user);
//           clearIntervalVal(activeUsers[user].activeGame);
//           const player = getPlayerFromRoom(user.activeGame);

//           if (player) {
//             io.to(activeUsers[player].socket).emit("opponent abandoned");
//           }
//           const result = await OngoingGames.deleteMany({
//             $or: [{ player1: user }, { player2: user }],
//           });
//         }
//       }, 45000);
//     }
//   });
// };

const convertOngoingGameToPastGame = async (roomId, winnerId) => {
  const gameToSave = await OngoingGames.findOne({ room: roomId });
  if (!gameToSave) {
    console.log(`Game not found for room: ${roomId}`);
    return;
  }
  const newPastGame = new PastGames({
    gameId: roomId,
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
  resetUser(gameToSave.player1);
  resetUser(gameToSave.player2);
  await OngoingGames.deleteOne({ room: roomId });
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

const addVote = (voteInfo) => {
  const { gameRoom, square, fen } = voteInfo;

  if (!activeGames[gameRoom]) activeGames[gameRoom] = {};

  if (!activeGames[gameRoom].votes) {
    activeGames[gameRoom].votes = [];
  }

  activeGames[gameRoom].votes.push({ square, fen });
};

const clearVotes = (gameRoom) => {
  if (!activeGames[gameRoom]) return;
  activeGames[gameRoom].votes = [];
};

const getMajorityVote = (gameRoom) => {
  const votes = activeGames[gameRoom]?.votes;

  if (!votes) return null;

  let majorCount = 0;
  let majorityVote = null;
  for (let i = 0; i < votes.length; i++) {
    let currCount = 0;
    let currSquare = votes[i].square;
    for (let j = 0; j < votes.length; j++) {
      if (
        currSquare &&
        votes[j].square &&
        currSquare[0] === votes[j].square[0] &&
        currSquare[1] === votes[j].square[1]
      ) {
        currCount++;
      }
    }
    if (currCount > majorCount) {
      majorCount = currCount;
      majorityVote = votes[i];
    }
  }
  return majorityVote;
};

module.exports = {
  addSocket,
  addActiveGame,
  isExistingActivePlayer,
  getUserActiveGame,
  getPlayerFromRoom,
  disconnectPlayer,
  getActiveGames,
  getActiveUsers,
  getTime,
  updateActiveGame,
  resetUser,
  addVote,
  clearVotes,
  getMajorityVote,
  initActiveGame,
  getInterval,
  setIntervalVal,
  clearIntervalVal,
  convertOngoingGameToPastGame,
  findUserBySocket,
  removeSocketId,
};
