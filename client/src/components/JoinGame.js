/*
  This file serves the following FRs:
  FR25 - Select.Side
*/


import React from "react";
import { Button, Modal, TextField, Fab } from "@mui/material";
import styled from "styled-components";

const ModalContainer = styled.div`
  position: absolute;
  background-color: black;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border-radius: 8px;
  max-width: 80%;
  border: 2px solid #ccc; /* Border added */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ModalTitle = styled.h2`
  margin-right: 10px;
  margin-bottom: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  width: 90%;
  max-width: 400px;
`;

const JoinGame = ({
  isModalOpen,
  handleCloseModal,
  roomCode,
  handleRoomCodeChange,
  handleJoinRoom,
  submitClicked,
}) => {
  return (
    <Modal
      open={isModalOpen}
      aria-labelledby="join-game-modal-title"
      aria-describedby="join-game-modal-description"
      onClose={handleCloseModal}
    >
      <ModalContainer>
        <ModalHeader>
          <ModalTitle id="join-game-modal-title">Join Game</ModalTitle>
        </ModalHeader>
        <ContentWrapper>
          <TextField
            id="room-code"
            label="Room Code"
            variant="outlined"
            value={roomCode}
            onChange={handleRoomCodeChange}
            error={submitClicked && roomCode.trim() === ""}
            helperText={
              submitClicked && roomCode.trim() === ""
                ? "Please enter the room code."
                : ""
            }
            style={{ marginTop: "2em" }}
          />
          <Button
            variant="contained"
            style={{ marginTop: "2em" }}
            onClick={handleJoinRoom}
          >
            Join Room
          </Button>
        </ContentWrapper>
      </ModalContainer>
    </Modal>
  );
};

export default JoinGame;
