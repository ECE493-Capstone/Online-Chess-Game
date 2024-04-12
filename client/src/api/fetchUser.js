/*
  This file serves the following FRs:
  FR1 - Request.Resgistration
  FR2 - Request.Login
  FR3 - Change.Password
  FR4 - Change.Username
*/
import axios from "axios";
import serverApiConfig from "./apiConfig";

export const fetchUser = async (userId) => {
  return await axios.post(`${serverApiConfig.SERVER_URL}/fetchuser`, {
    id: userId,
  });
};
