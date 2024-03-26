import axios from "axios";
import { SERVER_URL } from "./apiConfig";

export const getOngoingGameInformation = async (player) => {
  const response = await axios.get(`${SERVER_URL}/game/ongoing/${player}`);
  return response.data;
};
