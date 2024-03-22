import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, TextField, Fab } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Header from "../Header";
import "../styles.css";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-height: 80vh;
  padding-bottom: 20px;
`;

const StyledButton = styled(Button)`
  margin-right: 10px;
  flex-grow: 1;
  max-width: 300px;
  height: auto;
  text-transform: none;
`;

const ButtonContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 20px;
`;

const Subtitle = styled.div`
  font-size: 14px;
  text-transform: none;
`;

const RightButton = styled(Button)`
  margin-bottom: 10px;
  width: 100%;
  max-width: 150px;
  text-transform: none;
  height: 3vh;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

const ModalContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border-radius: 8px;
  max-width: 90%;
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

const ModalLine = styled.div`
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

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  const navigate = useNavigate();

  const handleJoinGame = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSubmitClicked(false);
  };

  const handleRoomCodeChange = (event) => {
    setRoomCode(event.target.value);
  };

  const handleJoinRoom = () => {
    setSubmitClicked(true);

    if (roomCode.trim() === "") {
      console.error("Please enter the room code.");
      return;
    }

    console.log("Joining room with code:", roomCode);
    navigate('/match');
    setIsModalOpen(false);
  };

  const handleQuickPlayClick = () => {
    navigate('/timeselect');
  };

  const handleCreateGameClick = () => {
    navigate('/gameselect');
  };

  return (
    <Header>
      <div>
        <h1>Home Page</h1>
      </div>
      <Container>
        <div style={{ display: "flex", alignItems: "center"}}>
          <StyledButton variant="contained" className="standard" onClick={handleQuickPlayClick}>
            <ButtonContent>
              <Title>Quick Play</Title>
              <Subtitle>Standard, blind, or power up chess</Subtitle>
            </ButtonContent>
          </StyledButton>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px"}}>
            <RightButton id="create-game-button" variant="contained" className="standard" onClick={handleCreateGameClick}>
              Create Game
            </RightButton>
            <RightButton id="join-game-button" variant="contained" className="standard" onClick={handleJoinGame}>
              Join Game
            </RightButton>
          </div>
        </div>
      </Container>

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
              <Button variant="contained" className="standard" style={{ marginTop: "2em" }} onClick={handleJoinRoom}>Join Room</Button>
            </ContentWrapper>
        </ModalContainer>
      </Modal>
    </Header>
  );
};

export default Home;