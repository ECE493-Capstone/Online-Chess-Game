import React, { useState } from 'react';
import Header from "../Header";
import ChangePassword  from '../ChangePassword';
import ChangeUsername  from '../ChangeUsername';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Button } from "@mui/material";
import { useLocation } from "react-router-dom";

const UserInfo = ({ username, email, statistics }) => {
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openChangeUsername, setOpenChangeUsername] = useState(false);

  const handleOpenChangePassword = () => {
    setOpenChangePassword(true);
  };

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
  };

  const handleOpenChangeUsername = () => {
    setOpenChangeUsername(true);
  };

  const handleCloseChangeUsername = () => {
    setOpenChangeUsername(false);
  };


  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "1", marginRight: '20px' }}>
        <h2>Profile Information</h2>
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Email:</strong> {email}</p>
          <Button variant="contained" onClick={handleOpenChangeUsername}>Change Username</Button>
        </div>
        <div>
        <Button variant="contained" onClick={handleOpenChangePassword}>Change Password</Button>
        </div>
      </div>
      <div>
        <h2>Statistics</h2>
        <ul>
          {Object.entries(statistics).map(([key, value]) => (
            <li key={key}><strong>{key}:</strong> {value}</li>
          ))}
        </ul>
      </div>
      <Modal
        open={openChangePassword}
        onClose={handleCloseChangePassword}
        aria-labelledby="change-password-modal"
        aria-describedby="change-password-form"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <ChangePassword onClose={handleCloseChangePassword}/>
        </Box>
      </Modal>
      <Modal
        open={openChangeUsername}
        onClose={handleCloseChangeUsername}
        aria-labelledby="change-username-modal"
        aria-describedby="change-username-form"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <ChangeUsername onClose={handleCloseChangeUsername}/>
        </Box>
      </Modal>
    </div>
  );
};

const Profile = () => {
  // const user = {
  //   username: 'exampleUser',
  //   email: 'user@example.com',
  //   statistics: {
  //     gamesPlayed: 10,
  //     wins: 5,
  //     losses: 5,
  //     draws: 0
  //   }
  // };
  const location = useLocation();
  const { username, email, userId } = location.state;

  return (
    <Header>
      <div>
        <div>
          <h1>Profile Page</h1>
          <UserInfo
            username={username}
            email={email}
          />
        </div>
      </div>
    </Header>
  );
};

export default Profile;
