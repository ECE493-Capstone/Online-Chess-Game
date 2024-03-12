const Socket = require("../../models/Socket");
const { deleteOneFromQueue } = require("./queueUtils");

const addSocketConnection = async (data) => {
  const socket = new Socket(data);
  await socket.save();
};

const removeSocketConnection = async (data) => {
  const result = await Socket.deleteOne(data);
};
const removeSocketConnectionBySocketId = async (socketId) => {
  await removeSocketConnection({ socketId });
};

const handleDisconnection = async (socketId) => {
  await deleteOneFromQueue({ socketId });
};

module.exports = {
  addSocketConnection,
  removeSocketConnection,
  removeSocketConnectionBySocketId,
  handleDisconnection,
};
