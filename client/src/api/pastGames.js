import axios from "axios";
import serverApiConfig from "./apiConfig";

export const getPastGamesInformation = async (player) => {
  // console.log("getPastGamesInformation: " + player);
  const response = await axios.get(
    `${serverApiConfig.SERVER_URL}/games/past/byPlayer`,
    {
      params: {
        player: player,
      },
    }
  );
  return response.data;
};

export const getPastGamesInformationWithOpponent = async (player, opponent) => {
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
};

export const getPastGamesInfoById = async (gameId) => {
  const response = await axios.get(
    `${serverApiConfig.SERVER_URL}/games/past/byId`,
    {
      params: {
        gameId: gameId,
      },
    }
  );
  return response.data;
};
