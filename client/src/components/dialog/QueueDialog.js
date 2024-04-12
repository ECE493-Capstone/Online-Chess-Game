/*
  This file serves the following FRs:
  FR5 - Queue.Enter
  FR6 - Queue.Exit
*/

import React, { useReducer, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import styled from "styled-components";
import { useEffect } from "react";
import { Button } from "@mui/material";
import toast from "react-hot-toast";

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  border: 1px solid white;
  background-color: black;
  border-radius: 10px;
  max-width: 400px;
  padding: 10px;

  .code {
    display: flex;
    margin-top: 15px;
  }

  .cancel-button {
    margin-top: 15px;
  }
`;

const QueueDialog = ({
  content,
  showSpinner = true,
  roomCode,
  onCancelClicked,
}) => {
  const copyRoomToClipboard = (roomCode) => {
    navigator.clipboard.writeText(roomCode);
    toast.success("Room code copied to clipboard");
  };
  return (
    <DialogContainer>
      <h3>{content}</h3>
      {showSpinner && <CircularProgress size={30} />}
      {roomCode && (
        <div className="code">
          <Button
            variant="outlined"
            onClick={() => copyRoomToClipboard(roomCode)}
          >
            {roomCode}
          </Button>
        </div>
      )}
      <Button
        className="cancel-button"
        variant="contained"
        onClick={onCancelClicked}
      >
        Cancel
      </Button>
    </DialogContainer>
  );
};

export default QueueDialog;
