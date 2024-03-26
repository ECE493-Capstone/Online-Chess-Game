const randomstring = require("randomstring");
const createRoom = () => {
  return randomstring.generate();
};

module.exports = { createRoom };
