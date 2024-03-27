import axios from "axios";
import serverApiConfig from "./apiConfig";

export const fetchUser = async (userId) => {
  return await axios.post(`${serverApiConfig.SERVER_URL}/fetchuser`, {
    id: userId,
  });
};
