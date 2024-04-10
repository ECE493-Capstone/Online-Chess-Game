const OngoingGames = require("../../models/OngoingGames");
const PastGames = require("../../models/PastGames");
const Queue = require("../../models/Queue");

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

  module.exports = {
    handleCreateGame,
  };