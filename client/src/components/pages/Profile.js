import React, { useState, useEffect } from 'react';
import Header from "../Header";
import ChangePassword  from '../ChangePassword';
import ChangeUsername  from '../ChangeUsername';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { fetchUser } from "../../api/fetchUser";
import Statistics from "../Statistics";

const PageContainer = styled.div`
  display: flex;
  background-color: rgb(184, 184, 184);
  min-height: 100vh;
  overflow: hidden;
  flex-direction: column;

`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${'' /* background-color: black; */}
  width: 40%;
  min-width: 40%;
  gap: 10px;
`;

const StyledButton = styled(Button)`
  min-width: 50%;

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

const cookie = new Cookies();

const UserInfo = ({statistics}) => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openChangeUsername, setOpenChangeUsername] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const checkLoginStatus = async () => {
    try {
      const storedUserId = cookie.get("userId");
  
      if (storedUserId) {
        console.log('Retrieved user ID from cookie: ' + storedUserId);
        setIsLoggedIn(true);
  
        const response = await fetchUser(storedUserId);
        const userData = response.data;
  
        if (response.status === 200) {
          const { username, email } = userData;
          setUsername(username);
          setEmail(email);
          console.log("HEADER DETECTS LOGIN: userID: " + JSON.stringify(storedUserId) + " username: " + JSON.stringify(username) + " email: " + JSON.stringify(email));
        } else {
          console.log("Failed to fetch user data");
        }
      } else {
        console.log("Header doesn't detect login.");
        setIsLoggedIn(false);
        setUsername("");
        setEmail("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    if (isFocused) {
      checkLoginStatus();
      setIsFocused(false);
    }
  }, [isFocused]);


  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "25%"}}>
        <h2>Profile Information</h2>
        <ProfileInfo>
          <Title>{username}</Title>
          <Subtitle>({email})</Subtitle>
          <StyledButton variant="contained" onClick={handleOpenChangeUsername}>Change Username</StyledButton>
          <StyledButton variant="contained" onClick={handleOpenChangePassword}>Change Password</StyledButton>
        </ProfileInfo>
      </div>
      <div style={{ flex: "75%", padding: "10px" }}>
        <Statistics
          gamesPlayed={statistics.gamesPlayed}
          wins={statistics.wins}
          losses={statistics.losses}
          draws={statistics.draws}
        />
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
            backgroundColor: "transparent",
            p: 4,
            borderRadius: "8px",
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
            }}
          >
          <ChangePassword onClose={handleCloseChangePassword} setIsFocused={setIsFocused}/>
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
            backgroundColor: "transparent",
            p: 4,
            borderRadius: "8px",
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
            }}
          >
          <ChangeUsername onClose={handleCloseChangeUsername} setIsFocused={setIsFocused}/>
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

  // const sampleUsername = "bruh";
  // const sampleEmail = "bruh@example.com";
  const sampleStatistics = {
    gamesPlayed: 10,
    wins: 5,
    losses: 5,
    draws: 0
  }
  const location = useLocation();
  // const { username, email, userId } = location.state;

  return (
    <Header>
      <PageContainer>
        <div>
          <h1>Profile Page</h1>
          <UserInfo
            // username={username}
            // email={email}
            statistics={sampleStatistics}
          />
        </div>
      </PageContainer>
    </Header>
  );
};

export default Profile;
