/*
  This file serves the following FRs:
  FR12 - Board.Create
*/

import axios from "axios";
import serverApiConfig from "./apiConfig";

export const getOngoingGameInformationByPlayer = async (player) => {
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

export const getOngoingGameInformationByGameId = async (gameId) => {
  const response = await axios.get(
    `${serverApiConfig.SERVER_URL}/games/ongoing/byGameId`,
    {
      params: {
        gameId: gameId,
      },
    }
  );
  return response.data;
};
