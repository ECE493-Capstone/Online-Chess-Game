import axios from "axios";
import serverApiConfig from "./apiConfig";

export const getPastGamesInformation = async (player) => {
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
