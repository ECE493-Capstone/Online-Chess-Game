const emitToRoom = (socketIo, room, event, data) => {
  socketIo.to(room).emit(event, data);
};

module.exports = { emitToRoom };
