const axios = require("axios");
const serverApiConfig = require("./apiConfig");

const fetchUser = async (username) => {
  try {
    // console.log("Trying the response:" + username);
    const response = await axios.post(`${serverApiConfig.SERVER_URL}/fetchuser/byName`, {
      username: username,
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching user");
    return null; // Return null in case of an error
  }
};

module.exports = { fetchUser };