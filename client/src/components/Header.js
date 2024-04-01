import React, { useState, useEffect } from "react";
import { Button, Modal, Box, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { fetchUser } from "../api/fetchUser";
const StyledHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  svg {
    stroke: #22a186;
    stroke-width: 0.5;
  }
  background-image: linear-gradient(
    to right bottom,
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.4),
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0)
  );
`;

const HeaderElements = ({ setOthersIsLoggedIn }) => {
  const navigate = useNavigate();
  const [openlogin, setOpenLogin] = useState(false);
  const [openregister, setOpenRegister] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(true);

  const cookie = new Cookies();

  const checkLoginStatus = async () => {
    try {
      const storedUserId = cookie.get("userId");

      if (storedUserId) {
        console.log("Retrieved user ID from cookie: " + storedUserId);
        setIsLoggedIn(true);
        setOthersIsLoggedIn(true);

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
        } else {
          console.log("Failed to fetch user data");
        }
      } else {
        console.log("Header doesn't detect login.");
        setIsLoggedIn(false);
        setOthersIsLoggedIn(false);
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

  const handleSignInClick = () => {
    setOpenLogin(true);
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const handleRegisterClick = () => {
    setOpenRegister(true);
  };

  const handleCloseRegister = () => {
    setOpenRegister(false);
  };

  const handleUserIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    setAnchorEl(null);
    navigate("/profile");
  };

  const handleLogoutClick = () => {
    setAnchorEl(null);
    // Clear items from localStorage upon logout
    setUsername(username);
    setEmail(email);
    cookie.remove("userId");
    setIsFocused(true);
    // navigate('/');
  };

  return (
    <>
      <div
        style={{
          // backgroundColor: "#f0f0f0",
          padding: "10px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {isLoggedIn ? (
          <>
            <Button
              style={{ marginRight: "5px", textTransform: "none" }}
              onClick={handleUserIconClick}
            >
              <AccountCircleIcon fontSize="large" style={{ color: "black" }} />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              style={{
                color: "white",
                fontSize: "18px",
                backgroundColor: "transparent",
                marginRight: "5px",
                textTransform: "none",
              }}
              onClick={handleSignInClick}
            >
              Sign in
            </Button>
            <Button
              variant="contained"
              style={{
                color: "white",
                backgroundColor: "red",
                marginRight: "5px",
                fontSize: "18px",
                textTransform: "none",
              }}
              onClick={handleRegisterClick}
            >
              Sign up
            </Button>
          </>
        )}
      </div>
      <Modal
        open={openlogin}
        onClose={handleCloseLogin}
        aria-labelledby="login-modal"
        aria-describedby="login-form"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            p: 4,
            borderRadius: "8px",
            Width: "90vw",
            Height: "90vh",
            overflow: "auto",
            backgroundColor: "transparent",
          }}
        >
          <Login onClose={handleCloseLogin} setIsFocused={setIsFocused} />
        </Box>
      </Modal>
      <Modal
        open={openregister}
        onClose={handleCloseRegister}
        aria-labelledby="register-modal"
        aria-describedby="register-form"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            p: 4,
            borderRadius: "8px",
            Width: "90vw",
            Height: "90vh",
            overflow: "auto",
            backgroundColor: "transparent",
          }}
        >
          <Registration onClose={handleCloseRegister} />
        </Box>
      </Modal>
    </>
  );
};

const Header = ({ children, setOthersIsLoggedIn }) => {
  return (
    <div>
      <StyledHeader>
        <HeaderElements setOthersIsLoggedIn={setOthersIsLoggedIn} />
      </StyledHeader>
      <div>{children}</div>
    </div>
  );
};

export default Header;
