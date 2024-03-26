import React from "react";
import styled from "styled-components";
import TimeSelect from "./TimeSelect";
import { Button } from "@mui/material";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { socket } from "../app/socket";
import { setGameInfo } from "../features/userSlice";
import { TimeControlCategories } from "../app/constant";

const StyledPlayTypeContainer = styled.div`
  display: flex;
`;
const PlayType = () => {
  const [tcId, setTcId] = React.useState(0);
  const cookies = new Cookies();
  const userId = cookies.get("userId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSetTcId = (id) => {
    setTcId(id);
  };
  const handleSubmit = () => {
    if (userId) {
      socket.emit("join game", {
        userId: userId,
        mode: "standard",
        side: userId === "65e2755c28bd77ea3394d6e5" ? "w" : "b",
        timeControl: TimeControlCategories[Math.floor(tcId / 3)][tcId % 3].tc,
      });
      socket.on("game joined", (gameInfo) => {
        dispatch(setGameInfo(gameInfo));
        navigate(`/match/${gameInfo}`);
      });
    }
  };
  return (
    <StyledPlayTypeContainer>
      <TimeSelect handleTcSelect={handleSetTcId} />
      <Button variant="filled" onClick={handleSubmit}>
        Start Game
      </Button>
    </StyledPlayTypeContainer>
  );
};

export default PlayType;
