import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useReducer, useState } from "react";
import styled from "styled-components";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import { SERVER_URL } from "../config";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { fetchUser } from "../api/fetchUser";

const ChangeUsernameContainer = styled.div`
  border: 1px solid white;
  border-radius: 10px;
  padding: 0px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  max-width: 300px;
  background-color: black;
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
const cookie = new Cookies();

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

const fetchEmail = async () => {
  try {
    const storedUserId = cookie.get("userId"); // Retrieve user ID from cookie

    if (storedUserId) {
      console.log('Retrieved user ID from cookie: ' + storedUserId);

      // Fetch username and email associated with the userId
      const response = await fetchUser(storedUserId);
      const userData = response.data;

      if (response.status === 200) {
        const { email } = userData;
        return email;
      } else {
        console.log("Failed to fetch user email");
      }
    } else {
      console.log("Login not detected.");
    }
  } catch (error) {
    console.log(error);
  }
};

const ChangeUsername = ({ onClose, setIsFocused }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [{ password, newUsername, errorMsg }, dispatch] = useReducer(
    ChangeUsernameReducer,
    {
      password: "",
      newUsername: "",
      errorMsg: "",
    }
  );

  const handleSubmit = async (e) => { // Make handleSubmit an async function
    e.preventDefault();
    setIsSubmitting(true);
    dispatch({ type: "SET_ERROR", payload: "" });

    try {
      const userEmail = await fetchEmail(); // Wait for fetchEmail to complete

      if (userEmail) {
        const res = await fetch(`${SERVER_URL}/changeusername`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            password: password,
            newUsername: newUsername,
          }),
        });

        if (res.status === 200) {
          console.log("Username changed successfully!");
          onClose();
          setIsFocused(true);
          // Redirect to previous page after username change
          // navigate(-1);
          return Promise.resolve(undefined);
        }

        const data = await res.json();
        dispatch({ type: "SET_ERROR", payload: data.message });
      } else {
        console.log('Error. Email not found in cookie');
        dispatch({ type: "SET_ERROR", payload: "Error finding user's email in cookie. Are you logged in?" });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
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
