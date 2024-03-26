import React, { useState, useEffect } from "react";
import { Button, Modal, Box, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styled from 'styled-components';

const StyledHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #f0f0f0;
  padding: 10px;
  display: flex;
  justify-content: flex-end;
`;

const HeaderElements = () => {
  const navigate = useNavigate();
  const [openlogin, setOpenLogin] = useState(false);
  const [openregister, setOpenRegister] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Check if the required items exist in localStorage
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (userId && storedUsername && storedEmail) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setEmail(storedEmail);
      setUserId(storedUserId);
    }
  }, []);

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
    navigate('/profile', { state: { username, email, userId } });
  };

  const handleLogoutClick = () => {
    setAnchorEl(null);
    setIsLoggedIn(false);
    // Clear items from localStorage upon logout
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
  };

  return (
    <>
      <div style={{ backgroundColor: "#f0f0f0", padding: "10px", display: "flex", justifyContent: "flex-end" }}>
        {isLoggedIn ? (
          <>
            <Button
              style={{ marginRight: "5px", textTransform: "none" }}
              onClick={handleUserIconClick}
            >
              <AccountCircleIcon style={{ color: 'black'}}/>
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
              style={{ backgroundColor: "transparent", marginRight: "5px", textTransform: "none" }}
              onClick={handleSignInClick}
            >
              Sign in
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "red", marginRight: "5px", textTransform: "none" }}
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
          <Login onClose={handleCloseLogin}/>
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
          <Registration onClose={handleCloseRegister}/>
        </Box>
      </Modal>
    </>
  );
};

const Header = ({ children }) => {
  return (
    <div>
        <StyledHeader>
          <HeaderElements />
        </StyledHeader>
      <div>{children}</div>
    </div>
  );
};

export default Header;
