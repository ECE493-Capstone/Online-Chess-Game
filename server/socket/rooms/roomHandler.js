const handleRooms = (io, socket) => {
  socket.on("create room", (roomId) => {
    socket.join(roomId);
    io.emit("room created", roomId);
  });

  socket.on("join room", (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit("player joined", socket.id);
  });

  socket.on("leave room", (roomId) => {
    socket.leave(roomId);
    io.to(roomId).emit("player left", socket.id);
  });

  socket.on("disconnecting", () => {
    const rooms = Object.keys(socket.rooms);
    rooms.forEach((roomId) => {
      io.to(roomId).emit("player disconnected", socket.id);
    });
  });
};

module.exports = handleRooms;
