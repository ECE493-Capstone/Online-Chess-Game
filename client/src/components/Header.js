import React, { useState } from "react";
import { Button, Modal, Box, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const HeaderElements = () => {
  const navigate = useNavigate();
  const [openlogin, setOpenLogin] = useState(false);
  const [openregister, setOpenRegister] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // TODO: Edit so that we know when the user is logged in or not. For now, we hard-code it to true.
  const [isLoggedIn, setIsLoggedIn] = useState(true);


  const handleSignInClick = () => {
    // navigate('/login');
    setOpenLogin(true);
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const handleRegisterClick = () => {
    // navigate('/register');
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
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    setAnchorEl(null);
    setIsLoggedIn(false);
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
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
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
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
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
      <HeaderElements />
      <div>{children}</div>
    </div>
  );
};

export default Header;
