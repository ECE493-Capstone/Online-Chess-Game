import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { Tooltip } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import "./styles.css";
import styled from "styled-components";

const GameContainer = styled.div`
  border: 1px solid white;
  border-radius: 10px;
  padding: 0px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  max-width: 300px;
  div {
    margin: 2px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer {
    justify-content: flex-end;
    margin-top: 10px;
  }
`;

const GameSelect = () => {
  const navigate = useNavigate();

  const handleGameSelect = (gameMode) => {
    // You can perform any action here when a game mode is selected
    console.log("Selected game mode:", gameMode);
    // For demonstration, let's navigate to a hypothetical "/game" route
    navigate("/game");
  };

  return (
    <Header>
      <div style={{ textAlign: "center", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "stretch" }}>
        <h1>Game Selection</h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <GameContainer>
            <img src="placeholder_standard_image.jpg" alt="Standard" onClick={() => handleGameSelect("Standard")} />
            <div className="standard">
              <p>Standard Chess</p>
            </div>
          </GameContainer>
          <GameContainer>
            <img src="placeholder_blind_image.jpg" alt="Blind" onClick={() => handleGameSelect("Blind")} />
            <div className="standard">
              <p>Blind Chess<br/>Play chess without being able to view the board!</p>
            </div>
          </GameContainer>
          <GameContainer style={{ position: "relative" }}>
            <img src="placeholder_power_up_duck_image.jpg" alt="Power-up Duck" onClick={() => handleGameSelect("Power-up Duck")} />
            <div style={{ position: "absolute", top: 0, right: 0 }}>
              <Tooltip title="Info on the power-ups" placement="top-end" arrow>
                <div>
                  <InfoIcon />
                </div>
              </Tooltip>
            </div>
            <div className="standard">
              <p>Power-up Duck<br/>Play chess with a duck piece, controlled by the spectators! Additional power-up mechanics for certain chess pieces!</p>
            </div>
          </GameContainer>
        </div>
      </div>
    </Header>
  );
};

export default GameSelect;
