import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, TextField, Fab } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Header from "../Header";
import styled from "styled-components";
import { socket } from "../../app/socket";
import { useDispatch } from "react-redux";
import { setGameInfo } from "../../features/userSlice";
import Cookies from "universal-cookie";
import JoinGame from "../JoinGame";

const PageContainer = styled.div`
  display: flex;
  background-color: rgb(184, 184, 184);
  min-height: 100vh;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
`;

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

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGameSelectModalOpen, setIsGameSelectModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  const cookies = new Cookies();
  const userId = cookies.get("userId");
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

    socket.emit("join private game", {
      userId: userId,
      room: roomCode,
    });

    socket.on("game joined", (gameInfo) => {
      dispatch(setGameInfo(gameInfo));
      navigate(`/match/${gameInfo}`);
    });

    socket.on("join fail", (gameInfo) => {
      console.log("Failed to join room with code:", roomCode);
    });
    setIsModalOpen(false);
  };

  const handleQuickPlayClick = () => {
    // navigate("/timeselect");
    navigate("/gameselect");
  };

  const handleCreateGameClick = () => {
    navigate("/gameselect");
  };

  const handleTestClick = () => {
    navigate("/h2htest");
  };

  return (
    <Header>
      <PageContainer>
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
              <ButtonContent>
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
              
              {/* Uncomment this to test the head2head */}
              <Button
                variant="contained"
                onClick={handleTestClick}
                style={{
                  backgroundColor: "black",
                  border: "2px solid white",
                  borderRadius: "8px",
                }}
              >
                <Title>Test Head2Head</Title>
              </Button>
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
      </PageContainer>
    </Header>
  );
};

export default Home;
