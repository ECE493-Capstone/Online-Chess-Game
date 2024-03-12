import React, { useState } from "react";
import { Button, Input } from "@mui/material";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { setGameInfo } from "../../features/userSlice";

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
  const socket = useSelector((state) => state.user.socket);
  const cookies = new Cookies();
  const userId = cookies.get("userId");
  const dispatch = useDispatch();
  const data = useSelector((state) => state.gameInfo);
  console.log(data);
  const handleJoinGame = () => {
    // if (userId) {
    //   const prob = Math.floor(Math.random() * 2);
    //   console.log(prob);
    //   console.log(userId);
    //   socket.emit("join game", {
    //     userId: userId,
    //     mode: "blindChess",
    //     side: userId === "65e2755c28bd77ea3394d6e5" ? "w" : "b",
    //     timeControl: "10+0",
    //   });
    //   socket.on("game joined", (room) => {
    //     console.log(room);
    //     setGameRoom(room);
    //   });
    //   socket.on("move", (input) => {
    //     console.log(`${userId} ${input}`);
    //   });
    // }
    dispatch(setGameInfo({ payload: "12345" }));
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
