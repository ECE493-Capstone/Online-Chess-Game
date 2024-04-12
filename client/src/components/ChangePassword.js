/*
  This file serves the following FRs:
  FR3 - Change.Password
*/

import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useReducer, useState } from "react";
import styled from "styled-components";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import { SERVER_URL } from "../config";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../api/fetchUser";

const ChangePasswordContainer = styled.div`
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

const ChangePasswordReducer = (state, action) => {
  switch (action.type) {
    case "SET_OLD_PASSWORD":
      return { ...state, oldPassword: action.payload, errorMsg: "" };
    case "SET_NEW_PASSWORD":
      return { ...state, newPassword: action.payload, errorMsg: "" };
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

const ChangePassword = ({ onClose, setIsFocused }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [{ oldPassword, newPassword, errorMsg }, dispatch] = useReducer(
    ChangePasswordReducer,
    {
      oldPassword: "",
      newPassword: "",
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
        const res = await fetch(`${SERVER_URL}/changepassword`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            oldPassword: oldPassword,
            newPassword: newPassword,
          }),
        });

        if (res.status === 200) {
          console.log("Password changed successfully!");
          setIsFocused(true);
          onClose();
          // Redirect to previous page after password change
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
      <ChangePasswordContainer>
        <h2>Change Password</h2>
        <div>
          <PasswordOutlinedIcon fontSize="large"></PasswordOutlinedIcon>
          <TextField
            required
            id="oldPassword"
            autoFocus={true}
            placeholder="Old Password"
            variant="outlined"
            value={oldPassword}
            type="password"
            onChange={(e) =>
              dispatch({ type: "SET_OLD_PASSWORD", payload: e.target.value })
            }
          ></TextField>
        </div>
        <div>
          <PasswordOutlinedIcon fontSize="large"></PasswordOutlinedIcon>
          <TextField
            required
            id="newPassword"
            placeholder="New Password"
            variant="outlined"
            value={newPassword}
            type="password"
            onChange={(e) =>
              dispatch({ type: "SET_NEW_PASSWORD", payload: e.target.value })
            }
          ></TextField>
        </div>
        {errorMsg && <Box color="error.main">{errorMsg}</Box>}
        <div className="footer">
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Change Password
          </Button>
        </div>
      </ChangePasswordContainer>
    </form>
  );
};

export default ChangePassword;
