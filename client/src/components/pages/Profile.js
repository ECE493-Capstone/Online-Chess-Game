import React, { useState, useEffect } from 'react';
import Header from "../Header";
import ChangePassword  from '../ChangePassword';
import ChangeUsername  from '../ChangeUsername';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { fetchUser } from "../../api/fetchUser";
import GameStatistics from "../Statistics";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const PageContainer = styled.div`
  display: flex;
  background-color: rgb(184, 184, 184);
  min-height: 100vh;
  flex-direction: column;

`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  ${'' /* background-color: black; */}
  width: 50%;
  gap: 10px;
`;

const StyledButton = styled(Button)`
  width: 70%;

`;

const Title = styled.div`
  font-size: 20px;
  color: white;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Subtitle = styled.div`
  font-size: 14px;
  text-transform: none;
  color: white;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const cookie = new Cookies();

const UserInfo = ({statistics, setIsLoggedIn}) => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openChangeUsername, setOpenChangeUsername] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  const longUsernameTest = "longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong"

  const navigate = useNavigate();

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
  
        const response = await fetchUser(storedUserId);
        const userData = response.data;
  
        if (response.status === 200) {
          const { username, email } = userData;
          setUsername(username);
          setEmail(email);
          console.log("HEADER DETECTS LOGIN: userID: " + JSON.stringify(storedUserId) + " username: " + JSON.stringify(username) + " email: " + JSON.stringify(email));
          setIsLoggedIn(true);
        } else {
          console.log("Failed to fetch user data");
        }
      } else {
        console.log("Profile doesn't detect login.");
        setUsername("");
        setEmail("");
        setIsLoggedIn(false);
        // navigate('/');
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
      <div style={{ paddingTop: "80px", paddingLeft: "10px", width:  "20%"}}>
        <ProfileInfo>
          <AccountCircleIcon fontSize="large" />
          <Title>{username}</Title>
          <Subtitle>({email})</Subtitle>
          <StyledButton variant="contained" onClick={handleOpenChangeUsername}>Change Username</StyledButton>
          <StyledButton variant="contained" onClick={handleOpenChangePassword}>Change Password</StyledButton>
        </ProfileInfo>
      </div>
      <div style={{ maxWidth:  "70%", padding: "10px", paddingTop: "60px"}}>
        <GameStatistics
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Header setOthersIsLoggedIn={setIsLoggedIn}>
      <PageContainer>
        {isLoggedIn ? (

              <UserInfo
                // username={username}
                // email={email}
                statistics={sampleStatistics}
                setIsLoggedIn={setIsLoggedIn}
              />

        ) : (

          <div style={{ paddingTop: "80px", alignItems: "center", textAlign: "center"}}>
              <h1>Please Log in to View this Page.</h1>
            </div>
        )}
      </PageContainer>
    </Header>
  );
};

export default Profile;
