import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { Popover } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import styled from "styled-components";
import Typography from '@mui/material/Typography';

const PageContainer = styled.div`
  display: flex;
  background-color: rgb(184, 184, 184);
  text-align: center;
  min-height: 100vh;
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
  border-top: 1px solid #ccc; /* Adjust color and thickness as needed */
  margin-top: 10px; /* Adjust spacing as needed */
`;

const GameSelect = () => {
  const navigate = useNavigate();

  const handleGameSelect = (gameMode) => {
    // You can perform any action here when a game mode is selected
    console.log("Selected game mode:", gameMode);
    // For demonstration, let's navigate to a hypothetical "/game" route
    navigate("/game");
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
          <GameContainer>
            <img src="placeholder_standard_image.jpg" alt="Standard" onClick={() => handleGameSelect("Standard")} />
            <Separator />
            <div>
              <ModalContent>
                <Title>Standard Chess</Title>
              </ModalContent>
            </div>
          </GameContainer>
          <GameContainer>
            <img src="placeholder_blind_image.jpg" alt="Blind" onClick={() => handleGameSelect("Blind")} />
            <Separator />
            <div>
              <ModalContent>
                  <Title>Blind Chess</Title>
                  <Subtitle>Play chess without being able to view the board!</Subtitle>
              </ModalContent>
            </div>
          </GameContainer>
          <GameContainer style={{ position: "relative" }}>
            <img src="placeholder_power_up_duck_image.jpg" alt="Power-up Duck" onClick={() => handleGameSelect("Power-up Duck")} />
            <Separator />
            <div style={{ position: "absolute", top: 0, right: 0 }}>
            <InfoIcon
              aria-describedby={id}
              onClick={handlePopoverOpen}
            >
              <InfoIcon />
            </InfoIcon>
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
              <Typography sx={{ p: 2 }}>Info on the power-ups</Typography>
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
