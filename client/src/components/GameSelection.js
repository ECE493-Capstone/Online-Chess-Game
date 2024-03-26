import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { Popover } from "@mui/material";
import { IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import styled from "styled-components";
import Typography from '@mui/material/Typography';
import StandardChessImage from '../img/Standard_Chess.png';
import BlindChessImage from '../img/Blind_Chess.png';
import PowerUpChessImage from '../img/Power_Up_Chess.png';

const PageContainer = styled.div`
  display: flex;
  background-color: rgb(184, 184, 184);
  text-align: center;
  min-height: 100vh;
  min-width: 100vh;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;

`;

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

const GameSelect = () => {
  const navigate = useNavigate();

  const handleGameSelect = (gameMode) => {
    console.log("Selected game mode:", gameMode);
    navigate("/timeselect");
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Header>
      <PageContainer>
        <div style={{ display: "flex", justifyContent: "center", gap:"10vw"}}>
          <GameContainer onClick={() => handleGameSelect("Standard")}>
            <img 
              src={StandardChessImage} 
              alt="Standard" 
              style={{ width: "200px", height: "auto" }}
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
              style={{ width: "200px", height: "auto" }}
            />
            <Separator />
            <div>
              <ModalContent>
                  <Title>Blind Chess</Title>
                  <Subtitle>Play chess without being able to view the board!</Subtitle>
              </ModalContent>
            </div>
          </GameContainer>
          <GameContainer style={{ position: "relative" }}  onClick={() => handleGameSelect("Power-up Duck")}>
            <img 
              src={PowerUpChessImage} 
              alt="Power-up Duck" 
              style={{ width: "200px", height: "auto" }}
            />
            <Separator />
            <div style={{ position: "absolute", top: 0, right: 0 }}>
              <IconButton
                aria-describedby={id}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
              >
              <InfoIcon/>
              </IconButton>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <Typography sx={{ p: 1 }}>Info on the power-ups</Typography>
              </Popover>
            </div>
            <div className="standard">
              <ModalContent>
                  <Title>Power-up Duck</Title>
                  <Subtitle>Play chess with a duck piece, controlled by the spectators! Additional power-up mechanics for certain chess pieces!</Subtitle>
              </ModalContent>
            </div>
          </GameContainer>
        </div>
      </PageContainer>
    </Header>
  );
};

export default GameSelect;
