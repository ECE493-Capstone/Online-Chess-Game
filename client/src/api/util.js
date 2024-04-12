/*
  This file serves the following FRs:
  FR17 - View.HeadToHeadRecord
*/

import axios from "axios";
import serverApiConfig from "./apiConfig";

export const getH2HRecord = async (player1Id, player2Id) => {
  const response = await axios.get(
    `${serverApiConfig.SERVER_URL}/games/past/h2h`,
    {
      params: {
        player1: player1Id,
        player2: player2Id,
      },
    }
  );
  return response.data;
};
