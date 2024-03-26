import { Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { setGameInfo } from "../features/userSlice";
import { socket } from "../app/socket";
import { TimeControlCategories } from "../app/constant";

const StyledTimeControlDiv = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  .tc-row {
    display: flex;
    .tc-box {
      color: white;
      cursor: pointer;
      display: flex;
      box-shadow: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 150px;
      min-height: 125px;
      margin: 5px;
      background-color: #404040;
      h1 {
        margin: 0px;
      }
    }
  }
`;

const TimeSelect = ({ handleTcSelect }) => {
  const cookies = new Cookies();
  const userId = cookies.get("userId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleButtonClick = (e) => {
    if (userId) {
      const tcId = parseInt(e.currentTarget.value) - 1;
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
    <StyledTimeControlDiv>
      {TimeControlCategories.map((tcRow, rowIndex) => (
        <div className="tc-row" key={rowIndex}>
          {tcRow.map((tcCat) => (
            <Button
              className="tc-box"
              value={tcCat.id}
              onClick={handleButtonClick}
              key={tcCat.id}
            >
              <h1>{tcCat.tc}</h1>
              <span>{tcCat.name}</span>
            </Button>
          ))}
        </div>
      ))}
    </StyledTimeControlDiv>
  );
};

export default TimeSelect;
