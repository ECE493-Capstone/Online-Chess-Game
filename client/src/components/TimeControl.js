import { Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { setGameInfo } from "../features/userSlice";
import { socket } from "../app/socket";
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
const TimeControlCategories = [
  [
    {
      id: 1,
      tc: "1 + 0",
      name: "Bullet",
    },
    {
      id: 2,
      tc: "2 + 1",
      name: "Bullet",
    },
    {
      id: 3,
      tc: "3 + 0",
      name: "Blitz",
    },
  ],
  [
    {
      id: 4,
      tc: "3 + 2",
      name: "Blitz",
    },
    {
      id: 5,
      tc: "5 + 0",
      name: "Blitz",
    },
    {
      id: 6,
      tc: "5 + 3",
      name: "Blitz",
    },
  ],
  [
    {
      id: 7,
      tc: "1 + 0",
      name: "Bullet",
    },
    {
      id: 8,
      tc: "2 + 1",
      name: "Bullet",
    },
    {
      id: 9,
      tc: "3 + 0",
      name: "Blitz",
    },
  ],
  [
    {
      id: 10,
      tc: "3 + 2",
      name: "Blitz",
    },
    {
      id: 11,
      tc: "5 + 0",
      name: "Blitz",
    },
    {
      id: 12,
      tc: "5 + 3",
      name: "Blitz",
    },
  ],
];
const TimeControl = () => {
  const isConnected = useSelector((state) => state.user.socket);
  const cookies = new Cookies();
  const userId = cookies.get("userId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleButtonClick = (e) => {
    if (userId && isConnected) {
      const tcId = parseInt(e.currentTarget.value) - 1;
      console.log(Math.floor(tcId / 3), tcId % 3);
      console.log(userId);
      socket.emit("join game", {
        userId: userId,
        mode: "blindChess",
        side: userId === "65e2755c28bd77ea3394d6e5" ? "w" : "b",
        timeControl: TimeControlCategories[Math.floor(tcId / 3)][tcId % 3].tc,
      });
      socket.on("game joined", (gameInfo) => {
        console.log(gameInfo);
        dispatch(setGameInfo(gameInfo));
        navigate(`/game/${gameInfo.room}`);
      });
      //   socket.on("move", (input) => {
      //     console.log(`${userId} ${input}`);
      //   });
    }
  };
  return (
    <StyledTimeControlDiv>
      {TimeControlCategories.map((tcRow) => (
        <div className="tc-row">
          {tcRow.map((tcCat) => (
            <Button
              className="tc-box"
              value={tcCat.id}
              onClick={handleButtonClick}
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

export default TimeControl;
