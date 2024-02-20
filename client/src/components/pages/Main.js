import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const socket = useSelector((state) => state.user.socket);
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const handleClick = () => {
    console.log(socket.id);
    socket.emit("abcd", { event: "aaa", msg: "bbb", id: socket.id });
  };

  socket.on("msgReceived", (data) => {
    alert(data);
  });
  return <button onClick={handleClick}>Join Game</button>;
};

export default Main;
