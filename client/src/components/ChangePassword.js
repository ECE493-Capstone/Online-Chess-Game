import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useReducer, useState } from "react";
import styled from "styled-components";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import { SERVER_URL } from "../config";
import { useNavigate } from "react-router-dom";

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

const ChangePassword = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [{ oldPassword, newPassword, errorMsg }, dispatch] = useReducer(
    ChangePasswordReducer,
    {
      oldPassword: "",
      newPassword: "",
      errorMsg: "",
    }
  );

//   const navigate = useNavigate();

const handleSubmit = (e) => {
    setIsSubmitting(true);
    dispatch({ type: "SET_ERROR", payload: "" });
  
    e.preventDefault();
  
    // Fetch email from local storage
    const userEmail = localStorage.getItem('email');
  
    // Check if userEmail is not null or undefined
    if (userEmail) {
      fetch(`${SERVER_URL}/changepassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail, // Use fetched email
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      })
        .then((res) => {
          setIsSubmitting(false);
          if (res.status === 200) {
            console.log("Password changed successfully!");
            onClose();
            // Redirect to previous page after password change
            // navigate(-1);
            return Promise.resolve(undefined);
          }
          return res.json();
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
