/*
  This file serves the following FRs:
  FR1 - Request.Resgistration
  FR2 - Request.Login
*/

import axios from "axios";
import serverApiConfig from "./apiConfig";

export const loginUser = async (identity, password) => {
  return await axios.post(`${serverApiConfig.SERVER_URL}/signin`, {
    identity: identity,
    password: password,
  });
};
export const registerUser = async (username, email, password) => {
  return await axios.post(`${serverApiConfig.SERVER_URL}/signup`, {
    username: username,
    email: email,
    password: password,
  });
};
