import { Button } from "@mui/material";
import React from "react";
import styled from "styled-components";
import JoinGame from "./JoinGame";

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-top: auto;
  padding-bottom: 10vh;
  overflow: hidden;
`;

const LeftButton = styled(Button)`
  width: 50%;
  height: 94%;
`;

const RightButton = styled(Button)`
  width: 100%;
  height: 100%;
`;

const ButtonContent = styled.div`
  display: flex;
  flex-direction: column;
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

const GameCreation = ({
  handleCreateGameClick,
  handleQuickPlayClick,
  handleJoinGame,
  isModalOpen,
  handleCloseModal,
  roomCode,
  handleRoomCodeChange,
  handleJoinRoom,
  submitClicked,
}) => {
  return (
    <>
      <ButtonContainer>
        <div style={{ display: "flex", alignItems: "center" }}>
          <LeftButton
            variant="contained"
            onClick={handleQuickPlayClick}
            style={{
              backgroundColor: "black",
              border: "2px solid white",
              borderRadius: "8px",
            }}
          >
            <ButtonContent id="quick-play">
              <Title>Quick Play</Title>
              <Subtitle>Standard, blind, or power up chess</Subtitle>
            </ButtonContent>
          </LeftButton>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              padding: "4px",
            }}
          >
            <RightButton
            id = "create-game"
              variant="contained"
              onClick={handleCreateGameClick}
              style={{
                backgroundColor: "black",
                border: "2px solid white",
                borderRadius: "8px",
              }}
            >
              <Title>Create Game</Title>
            </RightButton>
            <RightButton
              id = "join-game"
              variant="contained"
              onClick={handleJoinGame}
              style={{
                backgroundColor: "black",
                border: "2px solid white",
                borderRadius: "8px",
              }}
            >
              <Title>Join Game</Title>
            </RightButton>
          </div>
        </div>
      </ButtonContainer>
      <JoinGame
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        roomCode={roomCode}
        handleRoomCodeChange={handleRoomCodeChange}
        handleJoinRoom={handleJoinRoom}
        submitClicked={submitClicked}
      />
    </>
  );
};

export default GameCreation;
