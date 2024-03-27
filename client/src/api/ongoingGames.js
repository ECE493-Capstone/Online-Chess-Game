import axios from "axios";
import serverApiConfig from "./apiConfig";

export const getOngoingGameInformation = async (player) => {
  const response = await axios.get(
    `${serverApiConfig.SERVER_URL}/games/ongoing/byPlayer`,
    {
      params: {
        player: player,
      },
    }
  );
  return response.data;
};
