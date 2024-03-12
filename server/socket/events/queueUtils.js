const Queue = require("../../models/Queue");

const addToQueue = async (data) => {
  const queue = new Queue(data);
  await queue.save();
};
const deleteOneFromQueue = async (query) => {
  const result = await Queue.deleteOne(query);
};
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

const deleteUserFromQueue = async (userId) => {
  await deleteOneFromQueue({ userId });
};

module.exports = {
  addToQueue,
  findGameInQueue,
  deleteOneFromQueue,
  deleteUserFromQueue,
};
