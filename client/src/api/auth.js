import axios from "axios";
import serverApiConfig from "./apiConfig";

export const loginUser = async (identity, password) => {
  return await axios.post(`${serverApiConfig.SERVER_URL}/signin`, {
    identity: identity,
    password: password,
  });
};
export const registerUser = async (username, email, password) => {
    try {
    const response = await axios.post(`${serverApiConfig.SERVER_URL}/signup`, {
      username: username,
      email: email,
      password: password,
    });
    return response; // Return the response data
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.error("Conflict:", error.response.data.message);
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};
