const axios = require("axios");
const serverApiConfig = require("./apiConfig");

const getPastGamesInformation = async (player) => {
  try {
    const response = await axios.get(
      `${serverApiConfig.SERVER_URL}/games/past/byPlayer`,
      {
        params: {
          player: player,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching past games information:", error);
    return null;
  }
};

const getPastGamesInformationWithOpponent = async (player, opponent) => {
  try {
    const response = await axios.get(
      `${serverApiConfig.SERVER_URL}/games/past/byPlayerOpponent`,
      {
        params: {
          player: player,
          opponent: opponent,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching past games information with opponent:", error);
    return null;
  }
};

module.exports = {
  getPastGamesInformation,
  getPastGamesInformationWithOpponent,
};
