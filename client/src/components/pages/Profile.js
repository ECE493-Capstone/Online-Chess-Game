import React, { useState, useEffect } from "react";
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
import img from "../../assets/profile.svg";
import { getPastGamesInformation } from "../../api/pastGames";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GameHistory from "../GameHistory";

const StyledUserInfoContainer = styled.div`
  display: flex;
  margin: 100px;
  .section {
    display: flex;
    justify-content: center;
    background-color: #191d28;
    margin: 30px;
  }
  .games-info {
    min-width: 70vw;
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: scroll;

    &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #191d28;
    };

    &::-webkit-scrollbar {
      width: 12px;
      background-color: #191d28;
    };

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #555;
    };

    &::-webkit-scrollbar-thumb:hover {
      background: #3b3b3b; 
    }
  }
`;

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #12121b;
  max-height: 100vh;
  overflow: hidden;
  flex-direction: column;
`;

const ProfileInfo = styled.div`
  display: flex;
  padding: 50px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // align-items: stretch;
  min-width: 20vw;
  gap: 10px;
  button {
    margin-bottom: 10px;
    width: 200px;
  }
`;

const StyledButton = styled(Button)`
  width: 70%;
`;

const Title = styled.div`
  font-size: 32px;
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

const StyledScrollbar = styled.div`
 flex: 75%;
  padding: 10px;
  paddingTop: 60px;
  overflowX: hidden;
`;

const UserInfo = ({ statistics, setIsLoggedIn }) => {
  const cookie = new Cookies();
  const storedUserId = cookie.get("userId");
  const [username, setUsername] = useState("");

  const dummyData = [
    {
      gameId: 1,
      player2: username,
      player1: "white",
      mode: "Standard",
      timeControl: "timeControl",
      room: "room",
      fen: ["fen"],
      winner: username,
    },
    {
      gameId: 1,
      player2: username,
      player1: "white",
      mode: "Blind",
      timeControl: "timeControl",
      room: "room",
      fen: ["fen"],
      winner: username,
    },
    {
      gameId: 1,
      player2: "black",
      player1: username,
      mode: "PowerUp",
      timeControl: "timeControl",
      room: "room",
      fen: ["fen"],
      winner: "black",
    },
  ];

  const [email, setEmail] = useState("");
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openChangeUsername, setOpenChangeUsername] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [userId, setUserId] = useState("");
  const [anchorEl, setAnchorEl] = useState(false);
  const [data, setData] = useState([]);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      setUserId(storedUserId);
  
      if (storedUserId) {
        console.log("Retrieved user ID from cookie: " + storedUserId);

        const response = await fetchUser(storedUserId);
        const userData = response.data;

        if (response.status === 200) {
          const { username, email } = userData;
          setUsername(username);
          setEmail(email);
          console.log(
            "HEADER DETECTS LOGIN: userID: " +
              JSON.stringify(storedUserId) +
              " username: " +
              JSON.stringify(username) +
              " email: " +
              JSON.stringify(email)
          );
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

  // useEffect(() => {
  //   if (userId !== "") {

  //       // Fetch past games information when component mounts
  //       const fetchPastGames = async () => {
  //       try {
  //           const gamesData = await getPastGamesInformation(userId);
  //           setdATA(gamesData);
  //       } catch (error) {
  //           console.error('Error fetching past games:', error);
  //       }
  //       };

  //       fetchPastGames();
  //   }
  // }, [userId]);

  const handleSetData = async (mode) => {
    if (userId !== "") {
      try {
        const gamesData = await getPastGamesInformation(userId);
        if (mode === "All") {
          setData(gamesData);
        } else {
          console.log("Setting data for mode: " + mode);
          console.log("These are all the game datas: " + JSON.stringify(gamesData));
          setData(gamesData.filter((data) => data.mode === mode));
        }
      } catch (error) {
        console.error('Error fetching past games:', error);
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      checkLoginStatus();
      setIsFocused(false);
    }
  }, [isFocused]);

  useEffect(() => {
    getPastGamesInformation(storedUserId)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // initial loading of data
  useEffect(() => {
    const fetchData = async () => {
      if (userId !== "") {
        try {
          const gamesData = await getPastGamesInformation(userId);
          setData(gamesData);
        } catch (error) {
          console.error('Error fetching past games:', error);
        }
      }
    };
  
    fetchData();
  }, [userId]);

  return (
    <StyledUserInfoContainer>
      <div
        style={{
          flex: "20%",
          display: "flex",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        <ProfileInfo className="section">
          <img src={img} alt="profile" style={{ width: "175px" }}/>
          <Title>{username}</Title>
          <Subtitle>({email})</Subtitle>
          <StyledButton id="change-username" variant="contained" onClick={handleOpenChangeUsername}>
            Change Username
          </StyledButton>
          <StyledButton id="change-password" variant="contained" onClick={handleOpenChangePassword}>
            Change Password
          </StyledButton>
        </ProfileInfo>
      </div>
      <div
        className="section games-info"
        style={{ flex: "75%", padding: "10px", paddingTop: "60px", overflowX: "hidden"}}
      >
      {/* <StyledScrollbar> */}
        <GameStatistics
          gamesPlayed={statistics.gamesPlayed}
          wins={statistics.wins}
          losses={statistics.losses}
          draws={statistics.draws}
          handleSetData={handleSetData}
          data={data}
          userId={storedUserId}
        />
        <GameHistory data={data} username={username} userId={storedUserId} />
      </div>
      {/* </StyledScrollbar> */}
  
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
          <ChangePassword
            onClose={handleCloseChangePassword}
            setIsFocused={setIsFocused}
          />
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
          <ChangeUsername
            onClose={handleCloseChangeUsername}
            setIsFocused={setIsFocused}
          />
        </Box>
      </Modal>
    </StyledUserInfoContainer>
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
    draws: 0,
  };
  // const { username, email, userId } = location.state;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <Header setOthersIsLoggedIn={setIsLoggedIn} />
      <PageContainer>
        {isLoggedIn ? (
          <div>
            <UserInfo
              // username={username}
              // email={email}
              statistics={sampleStatistics}
              setIsLoggedIn={setIsLoggedIn}
            />
          </div>
        ) : (
          <div style={{ paddingTop: "80px", alignItems: "center" }}>
            <h1>Please Log in to View this Page.</h1>
          </div>
        )}
      </PageContainer>
    </>
  );
};

export default Profile;