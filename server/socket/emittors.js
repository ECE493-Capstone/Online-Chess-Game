/*
  This file serves the following FRs:
  FR2 - Request.Registration
*/
const emitToRoom = (socketIo, room, event, data) => {
  socketIo.to(room).emit(event, data);
};

module.exports = { emitToRoom };
