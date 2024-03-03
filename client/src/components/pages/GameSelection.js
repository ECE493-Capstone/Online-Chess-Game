import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { Tooltip } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import "../styles.css";

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
      <div style={{ textAlign: "center", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1>Game Selection</h1>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="standard" style={{ width: "300px", padding: "20px", margin: "0 10px" }}>
            <img src="placeholder_standard_image.jpg" alt="Standard" onClick={() => handleGameSelect("Standard")} />
            <p>Standard Chess</p>
          </div>
          <div className="standard" style={{ width: "300px", padding: "20px", margin: "0 10px" }}>
            <img src="placeholder_blind_image.jpg" alt="Blind" onClick={() => handleGameSelect("Blind")} />
            <p>Blind Chess<br/>Play chess without being able to view the board!</p>
          </div>
          <div className="standard" style={{ width: "300px", padding: "20px", margin: "0 10px", position: "relative" }}>
            <Tooltip title="Info on the power-ups" placement="top-end" arrow style={{ position: "absolute", top: 0, right: 0 }}>
              <div>
                <InfoIcon style={{ position: "absolute", top: 0, right: 0 }} />
              </div>
            </Tooltip>
            <img src="placeholder_power_up_duck_image.jpg" alt="Power-up Duck" onClick={() => handleGameSelect("Power-up Duck")} />
            <p>Power-up Duck<br/>Play chess with a duck piece, controlled by the spectators! Additional power-up mechanics for certain chess pieces!</p>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default GameSelect;
