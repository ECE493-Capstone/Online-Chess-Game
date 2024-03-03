import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, TextField, Fab } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Header from "./Header";
import "../styles.css";

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
    // Set submitClicked to true to trigger validation
    setSubmitClicked(true);

    // Check if roomCode is empty
    if (roomCode.trim() === "") {
      // Room code is empty, handle error or display error message
      // For now, let's just log an error message
      console.error("Please enter the room code.");
      return;
    }

    // implement validation here to see if the code is valid or not. Then join.
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
        {/*insert homepage wallpaper*/}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", minHeight: "80vh", paddingBottom: "20px"}}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <Button variant="contained" className="standard" style={{ marginRight: "10px", width: "300px", height: "83px", textTransform: "none"}} onClick={handleQuickPlayClick}>
          <div>
            <div style={{ fontSize: "20px" }}>Quick Play</div>
            <div style={{ fontSize: "14px" }}>Standard, blind, or power up chess</div>
          </div>
        </Button>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Button variant="contained" className="standard" style={{ marginBottom: "10px", width: "150px", textTransform: "none"}} onClick={handleCreateGameClick}>Create Game</Button>
            <Button variant="contained" className="standard" style={{ width: "150px", textTransform: "none"}} onClick={handleJoinGame}>Join Game</Button>
          </div>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        aria-labelledby="join-game-modal-title"
        aria-describedby="join-game-modal-description"
      >
        <div className="standard" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: "20px", borderRadius: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <h2 id="join-game-modal-title" style={{ marginRight: "10px", marginBottom: "0" }}>Join Game</h2>
            <div style={{ marginLeft: "auto" }}>
              <Fab onClick={handleCloseModal} style={{ width: "35px", height: "35px" }}><CloseIcon /></Fab>
            </div>
          </div>
          <div style={{ borderBottom: "1px solid #ccc", width: "100%", marginTop: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}></div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "30px", width: "300px"}}>
              <TextField
                id="room-code"
                label="Room Code"
                variant="outlined"
                value={roomCode}
                onChange={handleRoomCodeChange}
                error={submitClicked && roomCode.trim() === ""}
                helperText={(submitClicked && roomCode.trim() === "") ? "Please enter the room code." : ""}
                style={{ marginTop: "30px" }}
              />
              <Button variant="contained" className="standard" style={{ marginTop: "30px" }} onClick={handleJoinRoom}>Join Room</Button>
            </div>
          </div>
      </Modal>
    </Header>
  );
};

export default Home;
