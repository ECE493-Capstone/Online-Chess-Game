import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import TimeControl from "../TimeControl";
import { socket } from "../../app/socket";
import { useSelector } from "react-redux";

const Main = () => {
  const isConnected = useSelector((state) => state.user.socket);
  console.log(isConnected);
  if (isConnected) {
    console.log(socket.id);
  }
  return <TimeControl />;
};

export default Main;
