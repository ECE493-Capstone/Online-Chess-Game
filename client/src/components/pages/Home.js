// Simply a landing page to serve all FRs

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import styled from "styled-components";
import { socket } from "../../app/socket";
import { useDispatch } from "react-redux";
import { setGameInfo } from "../../features/userSlice";
import Cookies from "universal-cookie";
import img from "../../assets/chessbg.jpg";
import GameCreation from "../GameCreation";
import GameSelect from "../GameSelection";
import { FaChevronCircleLeft } from "react-icons/fa";
import TypeSubmit from "../TypeSubmit";
import toast from "react-hot-toast";
import QueueDialog from "../dialog/QueueDialog";
import { Dialog } from "@mui/material";

const PageContainer = styled.div`
  display: flex;
  background-image: url(${img});
  background-size: cover;
  background-position: 50% 50%;
  text-align: center;
  min-height: 100vh;
  overflow: hidden;
  flex-direction: column;
  justify-content: flex-end;
  .selection-container {
    display: flex;
    justify-content: center;
    width: 300vw;
    transform: ${(props) => `translateX(${props.direction})`};
    transition: transform 0.5s;
    // margin-top: ${(props) => (props.playType === null ? "50vh" : "0")};
    .game-create {
      transition: transform 0.5s;
    }
    .select-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 100vw;
      .back-icon {
        width: 80%;
        text-align: left;
        margin-bottom: 20px;
      }
      button {
        opacity: 0.7;
      }
      button:hover {
        opacity: 1;
      }
    }
    .game-select {
      margin-bottom: 50px;
    }
    .time-select {
      margin-bottom: 50px;
    }
  }
`;
const Home = () => {
  const [direction, setDirection] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [privateRoom, setPrivateRoom] = useState(null);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [playInfo, setPlayInfo] = useState({
    playType: null,
    gameMode: null,
    time: "1 + 0",
    side: "r",
  });
  const [showQueueDialog, setShowQueueDialog] = useState(false);
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
    socket.off("game joined");
    socket.off("join fail");
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

    socket.emit("join existing private game", {
      userId: userId,
      room: roomCode,
    });

    socket.once("game joined", (gameInfo) => {
      dispatch(setGameInfo(gameInfo));
      navigate(`/match/${gameInfo}`);
    });

    socket.once("join fail", (gameInfo) => {
      console.log("Failed to join room with code:", roomCode);
    });
    setIsModalOpen(false);
  };

  const handleQuickPlayClick = () => {
    setPlayInfo({ ...playInfo, playType: "quick play" });
    setDirection(direction + 1);
  };

  const handleCreateGameClick = () => {
    setPlayInfo({ ...playInfo, playType: "private game" });
    setDirection(direction + 1);
  };
  const handleTimeControlClick = (tc) => {
    console.log("Time control selected", tc);
    setPlayInfo({ ...playInfo, time: tc });
  };

  const handleSideClick = (side) => {
    console.log("Side selected", side);
    setPlayInfo({ ...playInfo, side: side });
  };

  const handleSubmit = () => {
    if (
      userId &&
      playInfo.side &&
      playInfo.time &&
      playInfo.gameMode &&
      playInfo.playType
    ) {
      socket.emit(`join ${playInfo.playType}`, {
        userId: userId,
        mode: playInfo.gameMode,
        type: playInfo.playType, // "Quick Play" or "Custom Game
        side:
          playInfo.side === "r"
            ? ["w", "b"][Math.floor(Math.random() * 2)]
            : playInfo.side,
        timeControl: playInfo.time,
      });
      socket.once("game joined", (gameInfo) => {
        dispatch(setGameInfo(gameInfo));
        navigate(`/match/${gameInfo}`);
      });
      socket.once("privateRoom", (privateRoom) => {
        console.log("Private room created:", privateRoom);
        setPrivateRoom(privateRoom);
      });
      setShowQueueDialog(true);
    } else {
      toast.error("Please login to play");
    }
  };
  const handleBackClick = () => {
    setDirection(direction - 1);
  };

  const handleGameSelect = (gameMode) => {
    console.log("Selected game mode:", gameMode);
    setPlayInfo({ ...playInfo, gameMode: gameMode });
    setDirection(direction + 1);
  };

  const handleExitQueue = (userId) => {
    console.log("Exiting queue...");
    socket.off("game joined");
    socket.emit("exit queue", userId);
    setShowQueueDialog(false);
    clearPrivateRoom();
  };

  const clearPrivateRoom = () => {
    socket.off("privateRoom");
    setPrivateRoom(null);
  };

  return (
    <>
      <Header />
      <PageContainer direction={String(-direction * 100) + "vw"}>
        <div className="selection-container">
          <div className="select-container game-create">
            <GameCreation
              handleCreateGameClick={handleCreateGameClick}
              handleQuickPlayClick={handleQuickPlayClick}
              handleJoinGame={handleJoinGame}
              roomCode={roomCode}
              handleRoomCodeChange={handleRoomCodeChange}
              handleJoinRoom={handleJoinRoom}
              isModalOpen={isModalOpen}
              handleCloseModal={handleCloseModal}
              submitClicked={submitClicked}
            />
          </div>
          <div className="select-container game-select">
            <div className="back-icon">
              <FaChevronCircleLeft
                onClick={() => {
                  setPlayInfo({ ...playInfo, playType: null });
                  handleBackClick();
                }}
                style={{ cursor: "pointer", fontSize: "2rem" }}
              />
            </div>
            <GameSelect handleGameSelectHome={handleGameSelect} />
          </div>
          <div className="select-container time-select">
            <div className="back-icon">
              <FaChevronCircleLeft
                onClick={() => {
                  setPlayInfo({ ...playInfo, playType: null });
                  handleBackClick();
                }}
                style={{ cursor: "pointer", fontSize: "2rem" }}
              />
            </div>
            <TypeSubmit
              handleTimeControlClick={handleTimeControlClick}
              handleSideClick={handleSideClick}
              side={playInfo.side}
              playType={playInfo.playType}
              handleSubmit={handleSubmit}
            />
          </div>
          <Dialog
            open={showQueueDialog}
            onClose={() => handleExitQueue(userId)}
          >
            <QueueDialog
              onCancelClicked={() => handleExitQueue(userId)}
              content={
                privateRoom
                  ? "Room created. Share to join!"
                  : "Finding an opponent..."
              }
              roomCode={privateRoom}
            />
          </Dialog>
        </div>
      </PageContainer>
    </>
  );
};

export default Home;
