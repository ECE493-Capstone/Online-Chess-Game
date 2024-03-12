const OngoingGames = require("../../models/OngoingGames");

const addToOngoingGames = async (data) => {
  const newGame = new OngoingGames(data);
  await newGame.save();
};

module.exports = {
  addToOngoingGames,
};
