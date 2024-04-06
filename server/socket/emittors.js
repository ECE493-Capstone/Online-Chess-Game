const emitToRoom = (socketIo, room, event, data) => {
  if (event === "spectatorMove") {
    console.log("WHHAH", room, event, data);
  }
  socketIo.to(room).emit(event, data);
};

module.exports = { emitToRoom };
