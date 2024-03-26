import React, { useState } from "react";
import { Button, Input } from "@mui/material";
import Cookies from "universal-cookie";
import styled from "styled-components";
import { socket } from "../../app/socket";

const StyledJoinContainer = styled.div`
  display: flex;
  flex-direction: column;
  .MuiInputBase-root {
    width: 200px;
  }
  button {
    width: 200px;
  }
`;
const TestJoin = () => {
  const [input, setInput] = useState("");
  const [gameRoom, setGameRoom] = useState(null);
  const cookies = new Cookies();
  const userId = cookies.get("userId");
  console.log(socket.id);
  const handleJoinGame = () => {
    if (userId) {
      const prob = Math.floor(Math.random() * 2);
      console.log(prob);
      console.log(userId);
      socket.emit("join game", {
        userId: userId,
        mode: "blindChess",
        side: userId === "65e2755c28bd77ea3394d6e5" ? "w" : "b",
        timeControl: "10+0",
      });
      socket.on("game joined", (room) => {
        console.log(room);
        setGameRoom(room);
      });
      socket.on("move", (input) => {
        console.log(`${userId} ${input}`);
      });
    }
  };
  const handleSendMessage = () => {
    if (gameRoom) {
      socket.emit("move piece", { gameRoom: gameRoom, input: input });
    }
  };
  return (
    <StyledJoinContainer>
      <Button variant="outlined" onClick={handleJoinGame}>
        Join Game
      </Button>
      <Input value={input} onChange={(e) => setInput(e.target.value)} />
      <Button onClick={handleSendMessage}>Send</Button>
    </StyledJoinContainer>
  );
};

export default TestJoin;
