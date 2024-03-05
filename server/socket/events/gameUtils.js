const OngoingGames = require("../../models/OngoingGames");
const Queue = require("../../models/Queue");
const findGameInQueue = async (mode, tc, side) => {
  const game = await Queue.findOne(
    { mode: mode, timeControl: tc, side: { $ne: side } },
    null,
    {
      sort: { joinTime: 1 },
    }
  );
  return game;
};

const addToOngoingGames = async (data) => {
  const newGame = new OngoingGames(data);
  await newGame.save();
};
const deleteOneFromQueue = async (query) => {
  const result = await Queue.deleteOne(query);
  console.log(result);
};

const handleDeleteUserFromQueue = async (userId) => {
  await deleteOneFromQueue({ userId });
};

const handleDisconnection = async (socketId) => {
  await deleteOneFromQueue({ socketId });
};

module.exports = {
  addToOngoingGames,
  findGameInQueue,
  deleteOneFromQueue,
  handleDisconnection,
};
