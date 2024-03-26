import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useReducer, useState } from "react";
import styled from "styled-components";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import { SERVER_URL } from "../config";
import { useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

const ChangeUsernameContainer = styled.div`
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

const ChangeUsernameReducer = (state, action) => {
  switch (action.type) {
    case "SET_PASSWORD":
      return { ...state, password: action.payload, errorMsg: "" };
    case "SET_NEW_USERNAME":
      return { ...state, newUsername: action.payload, errorMsg: "" };
    case "SET_ERROR":
      return { ...state, errorMsg: action.payload };
    default:
      return state;
  }
};

const ChangeUsername = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [{ password, newUsername, errorMsg }, dispatch] = useReducer(
    ChangeUsernameReducer,
    {
      password: "",
      newUsername: "",
      errorMsg: "",
    }
  );

  //   const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    dispatch({ type: "SET_ERROR", payload: "" });

    // Fetch email from local storage
    const userEmail = localStorage.getItem('email');

    // Check if userEmail is not null or undefined
    if (userEmail) {
      fetch(`${SERVER_URL}/changeusername`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail, // Use fetched email
          password: password,
          newUsername: newUsername,
        }),
      })
        .then((res) => {
          setIsSubmitting(false);
          if (res.status === 200) {
            console.log("Username changed successfully!");
            onClose();
            // Redirect to previous page after username change
            // navigate(-1);
            return Promise.resolve(undefined);
          }
          return res.json();
        })
        .then((data) => {
            if (data) {
              const username = data.username;
              // Store the user ID to localstorage
              localStorage.setItem('username', username);
              console.log("new username: " + JSON.stringify(username));
            }
        })
        .then((data) => {
          if (data === undefined) return;
          dispatch({ type: "SET_ERROR", payload: data.message });
        })
        .catch((err) => console.log(err));
    } else {
      // Handle case where email is not found in local storage
      console.log('Error. Email not found in local storage');
      dispatch({ type: "SET_ERROR", payload: "Error finding user's email in local storage. Are you logged in?" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ChangeUsernameContainer>
        <h2>Change Username</h2>
        <div>
          <PasswordOutlinedIcon fontSize="large"></PasswordOutlinedIcon>
          <TextField
            required
            id="password"
            autoFocus={true}
            placeholder="Password"
            variant="outlined"
            value={password}
            type="password"
            onChange={(e) =>
              dispatch({ type: "SET_PASSWORD", payload: e.target.value })
            }
          ></TextField>
        </div>
        <div>
          <AccountCircleOutlinedIcon fontSize="large" />
          <TextField
            required
            id="newUsername"
            placeholder="New Username"
            variant="outlined"
            value={newUsername}
            onChange={(e) =>
              dispatch({ type: "SET_NEW_USERNAME", payload: e.target.value })
            }
          ></TextField>
        </div>
        {errorMsg && <Box color="error.main">{errorMsg}</Box>}
        <div className="footer">
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Change Username
          </Button>
        </div>
      </ChangeUsernameContainer>
    </form>
  );
};

export default ChangeUsername;
