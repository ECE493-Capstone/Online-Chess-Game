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
import { TimeControlCategories } from "../../app/constant";
import toast from "react-hot-toast";

const PageContainer = styled.div`
  display: flex;
  background-image: url(${img});
  background-size: cover;
  backgroun-position: 50% 50%;
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
  const [isGameSelectModalOpen, setIsGameSelectModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  const [playInfo, setPlayInfo] = useState({
    playType: null,
    gameMode: null,
    time: "1 + 0",
    side: "r",
  });
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
      console.log("READY TO PLAY", playInfo);
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
      socket.on("game joined", (gameInfo) => {
        dispatch(setGameInfo(gameInfo));
        navigate(`/match/${gameInfo}`);
      });
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

  const handleTestClick = () => {
    navigate("/h2htest");
  };

  return (
    <Header>
<<<<<<< HEAD
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
=======
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
>>>>>>> f992b5dca06342f895ae0daf9afa371159219f36
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
        </div>
      </PageContainer>
    </Header>
  );
};

export default Home;
