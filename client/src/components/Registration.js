import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useReducer, useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

const RegistrationContainer = styled.div`
  background-color: black;
  border: 1px solid white;
  border-radius: 10px;
  padding: 0px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  max-width: 300px;
  div {
    margin: 2px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer {
    justify-content: flex-end;
    margin-top: 10px;
  }
`;

const RegisterReducer = (state, action) => {
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, username: action.payload, errorMsg: "" };
    case "SET_PASSWORD":
      return { ...state, password: action.payload, errorMsg: "" };
    case "SET_EMAIL":
      return { ...state, email: action.payload, errorMsg: "" };
    case "SET_ERROR":
      return { ...state, errorMsg: action.payload };
    default:
      return state;
  }
};

const Registration = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [{ username, password, email, errorMsg }, dispatch] = useReducer(
    RegisterReducer,
    {
      username: "",
      password: "",
      email: "",
      errorMsg: "",
    }
  );

  // const navigate = useNavigate(); // navigation element

  const handleSubmit = (e) => {
    setIsSubmitting(true);
    dispatch({ type: "SET_ERROR", payload: "" });

    e.preventDefault();
    // make a post call to the server to register the user and check response to see if the user was registered
    registerUser(username, email, password)
      .then((res) => {
        setIsSubmitting(false);
        if (res.status === 200) {
          console.log("User registered successfully");
          // route to the login page then return empty promise

          // route to the previous page the user was on
          onClose();
          // navigate(-1);
          return Promise.resolve(undefined);
        }
        return res.json();
      })
      .then((data) => {
        if (data === undefined) return;
        dispatch({ type: "SET_ERROR", payload: data.message });
      })
      .catch((err) => {
        dispatch({ type: "SET_ERROR", payload: err.message });
        console.log(err);
        setIsSubmitting(false);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <RegistrationContainer>
        <h2>Register</h2>
        <div>
          <AccountCircleOutlinedIcon fontSize="large" />
          <TextField
            required
            id="username"
            label="Enter Your Username"
            variant="outlined"
            value={username}
            onChange={(e) =>
              dispatch({ type: "SET_USERNAME", payload: e.target.value })
            }
          ></TextField>
        </div>
        <div>
          <PasswordOutlinedIcon fontSize="large"></PasswordOutlinedIcon>
          <TextField
            required
            id="password"
            label="Enter Your Password"
            variant="outlined"
            value={password}
            type="password"
            onChange={(e) =>
              dispatch({ type: "SET_PASSWORD", payload: e.target.value })
            }
          ></TextField>
        </div>
        <div>
          <EmailOutlinedIcon fontSize="large"></EmailOutlinedIcon>
          <TextField
            required
            id="email"
            label="Enter Your Email"
            variant="outlined"
            value={email}
            type="email"
            onChange={(e) =>
              dispatch({ type: "SET_EMAIL", payload: e.target.value })
            }
          ></TextField>
        </div>
        {errorMsg && <Box id="error-box" color="error.main">{errorMsg}</Box>}
        <div className="footer">
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Register
          </Button>
        </div>
      </RegistrationContainer>
    </form>
  );
};

export default Registration;
