import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useReducer, useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import Cookies from "universal-cookie";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

const LoginContainer = styled.div`
  border: 1px solid white;
  background-color: black;
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

const LoginReducer = (state, action) => {
  switch (action.type) {
    case "SET_IDENTITY":
      return { ...state, identity: action.payload, errorMsg: "" };
    case "SET_PASSWORD":
      return { ...state, password: action.payload, errorMsg: "" };
    case "SET_ERROR":
      return { ...state, errorMsg: action.payload };
    default:
      return state;
  }
};

const Login = ({ onClose, setIsFocused }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cookie = new Cookies();
  const navigate = useNavigate();
  const [{ identity, password, errorMsg }, dispatch] = useReducer(
    LoginReducer,
    {
      // identity can be either username or email
      identity: "",
      password: "",
      errorMsg: "",
    }
  );

  const handleSubmit = (e) => {
    setIsSubmitting(true);
    dispatch({ type: "SET_ERROR", payload: "" });

    e.preventDefault();
    loginUser(identity, password)
      .then((res) => {
        setIsSubmitting(false);
        console.log(res);
        if (res.status === 200) {
          console.log("User logged in successfully");
          cookie.set("userId", res.data.userId);
          console.log("Cookie userId:", cookie.get("userId")); // Log the cookie value
          setIsFocused(true);
          onClose();
          return Promise.resolve(undefined);
        }
      })
      .catch((err) => {
        dispatch({ type: "SET_ERROR", payload: err.response.data.message });
        setIsSubmitting(false);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <LoginContainer>
        <h2>Login</h2>
        <div>
          <AccountCircleOutlinedIcon fontSize="large" />
          <TextField
            required
            id="identity"
            autoFocus={true}
            placeholder="Username or Email"
            variant="outlined"
            value={identity}
            onChange={(e) =>
              dispatch({ type: "SET_IDENTITY", payload: e.target.value })
            }
          ></TextField>
        </div>
        <div>
          <PasswordOutlinedIcon fontSize="large"></PasswordOutlinedIcon>
          <TextField
            required
            id="password"
            placeholder="Password"
            variant="outlined"
            value={password}
            type="password"
            onChange={(e) =>
              dispatch({ type: "SET_PASSWORD", payload: e.target.value })
            }
          ></TextField>
        </div>
        {errorMsg && <Box color="error.main">{errorMsg}</Box>}
        <div className="footer">
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Login
          </Button>
        </div>
      </LoginContainer>
    </form>
  );
};

export default Login;
