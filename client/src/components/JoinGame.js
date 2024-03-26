import React from 'react';

import { Button, Modal, TextField, Fab } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

import styled from 'styled-components';

const ModalContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    border-radius: 8px;
    max-width: 90%;
    border: 2px solid #ccc; /* Border added */
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

const ModalLine = styled.hr`
    border-bottom: 1px solid #ccc;
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2em;
    width: 90%;
    max-width: 400px;
`;

const JoinGame = ({ isModalOpen, handleCloseModal, roomCode, handleRoomCodeChange, handleJoinRoom, submitClicked }) => {
  return (
    <Modal open={isModalOpen} aria-labelledby="join-game-modal-title" aria-describedby="join-game-modal-description">
      <ModalContainer className="standard">
        <ModalHeader>
          <ModalTitle id="join-game-modal-title">Join Game</ModalTitle>
          <div style={{ marginLeft: "auto" }}>
            <Fab onClick={handleCloseModal} style={{ width: "35px", height: "35px" }}><CloseIcon /></Fab>
          </div>
        </ModalHeader>
        <ModalLine></ModalLine>
        <ContentWrapper>
          <TextField
            id="room-code"
            label="Room Code"
            variant="outlined"
            value={roomCode}
            onChange={handleRoomCodeChange}
            error={submitClicked && roomCode.trim() === ""}
            helperText={(submitClicked && roomCode.trim() === "") ? "Please enter the room code." : ""}
            style={{ marginTop: "2em" }}
          />
          <Button className="standard" style={{ marginTop: "2em" }} onClick={handleJoinRoom}>Join Room</Button>
        </ContentWrapper>
      </ModalContainer>
    </Modal>
  );
};

export default JoinGame;
