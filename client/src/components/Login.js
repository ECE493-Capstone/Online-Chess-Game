import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useReducer, useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PasswordOutlinedIcon from "@mui/icons-material/PasswordOutlined";
import { SERVER_URL } from "../config";

const LoginContainer = styled.div`
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

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    fetch(`${SERVER_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identity: identity,
        password: password,
      }),
    })
      .then((res) => {
        setIsSubmitting(false);
        if (res.status === 200) {
          console.log("User logged in successfully");
          // TODO: route to landing page
          return Promise.resolve(undefined);
        }
        return res.json();
      })
      .then((data) => {
        if (data === undefined) return;
        dispatch({ type: "SET_ERROR", payload: data.message });
      })
      .catch((err) => console.log(err));
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
