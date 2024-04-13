const axios = require("axios");
const serverApiConfig = require("./apiConfig");

const removeUser = async (username) => {
    try {
      const response = await axios.delete(`${serverApiConfig.SERVER_URL}/fetchuser/removeName`, {
        data: { username: username }, // Send username in the request body
      });
      return response.data; // Return the response data
    } catch (error) {
      console.error("Error removing user");
      return null; // Return null in case of an error
    }
  };

module.exports = { removeUser };