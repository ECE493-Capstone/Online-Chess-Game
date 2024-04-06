import { Button, TextField } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { RiUserVoiceFill } from "react-icons/ri";

const StyledBlindChessContainer = styled.div`
  display: flex;
  max-width: 75%;
  > div {
    padding: 100px;
  }
  .voice-input {
    display: flex;
    flex-direction: column;
    align-items: center;
    .recognized-move {
      margin-bottom: 20px;
    }
  }
  .text-button-input {
    border-right: solid 0.5px white;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 50%;
    .buttons-container {
      margin: 20px;
      display: flex;
      flex-wrap: wrap;
      max-width: 70%;
      justify-content: center;
      gap: 10px;
    }
  }
  input {
    height: 10px;
  }
`;
const BlindChess = () => {
  return (
    <StyledBlindChessContainer>
      <div className="text-button-input">
        <TextField variant="filled" />
        <div className="buttons-container">
          <Button variant="outlined">a7 a6</Button>
          <Button variant="outlined">a7 a6</Button>
          <Button variant="outlined">a7 a6</Button>
          <Button variant="outlined">a7 a6</Button>
          <Button variant="outlined">a7 a6</Button>
          <Button variant="outlined">a7 a6</Button>
          <Button variant="outlined">a7 a6</Button>
        </div>
        <Button variant="contained">Make Button Move</Button>
      </div>
      <div className="voice-input">
        <RiUserVoiceFill size={50} />
        <div className="start-stop-buttons">
          <Button className="start-record">Record Input</Button>
          <Button className="stop-record">Stop Recording</Button>
        </div>
        <div className="recognized-move">WOOO</div>
        <div className="submit-input">
          <Button variant="contained">Make Voice Move</Button>
        </div>
      </div>
    </StyledBlindChessContainer>
  );
};

export default BlindChess;
