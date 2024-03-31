import React from "react";
import { useNavigate } from "react-router-dom";
import { Popover } from "@mui/material";
import { IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import styled from "styled-components";
import Typography from "@mui/material/Typography";
import StandardChessImage from "../img/Standard_Chess.png";
import BlindChessImage from "../img/Blind_Chess.png";
import PowerUpChessImage from "../img/Power_Up_Chess.png";

const GameContainer = styled.div`
  border: 1px solid white;
  background-color: black;
  border-radius: 30px;
  padding: 0px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  min-height: 40vh;
  width: 20vw;
  align-items: center;
  cursor: pointer;
  .footer {
    justify-content: flex-end;
    margin-top: 10px;
  }
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;

const Title = styled.div`
  font-size: 20px;
  color: white;
`;

const Subtitle = styled.div`
  font-size: 14px;
  text-transform: none;
  color: white;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Separator = styled.div`
  width: 100%;
  border-top: 1px solid #ccc;
  margin-top: 10px;
`;

const GameSelect = ({ handleGameSelectHome }) => {
  const navigate = useNavigate();

  const handleGameSelect = (gameMode) => {
    handleGameSelectHome(gameMode);
    // navigate("/play-game");
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    // console.log("Popover opened");
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    // console.log("Popover closed");
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "10vw",
        margin: "0px 50px 0px 50px",
      }}
    >
      <GameContainer onClick={() => handleGameSelect("Standard")}>
        <img
          src={StandardChessImage}
          alt="Standard"
          style={{ width: "70%", height: "auto" }}
        />
        <Separator />
        <div>
          <ModalContent>
            <Title>Standard Chess</Title>
          </ModalContent>
        </div>
      </GameContainer>
      <GameContainer onClick={() => handleGameSelect("Blind")}>
        <img
          src={BlindChessImage}
          alt="Blind"
          style={{ width: "70%", height: "auto" }}
        />
        <Separator />
        <div>
          <ModalContent>
            <Title>Blind Chess</Title>
            <Subtitle>
              Play chess without being able to view the board!
            </Subtitle>
          </ModalContent>
        </div>
      </GameContainer>
      <GameContainer
        style={{ position: "relative" }}
        onClick={() => handleGameSelect("Power-up Duck")}
      >
        <img
          src={PowerUpChessImage}
          alt="Power-up Duck"
          style={{ width: "70%", height: "auto" }}
        />
        <Separator />
        <div style={{ position: "absolute", top: 0, right: 0 }}>
          <IconButton
            aria-describedby={open ? "mouse-over-popover" : undefined}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <InfoIcon />
          </IconButton>
          <Popover
            id="mouse-over-popover"
            sx={{
              pointerEvents: "none",
            }}
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            disableRestoreFocus
          >
            <Typography sx={{ p: 1 }}>Info on the power-ups</Typography>
          </Popover>
        </div>
        <div className="standard">
          <ModalContent>
            <Title>Power-up Duck</Title>
            <Subtitle>
              Play chess with a duck piece, controlled by the spectators!
              Additional power-up mechanics for certain chess pieces!
            </Subtitle>
          </ModalContent>
        </div>
      </GameContainer>
    </div>
  );
};

export default GameSelect;
