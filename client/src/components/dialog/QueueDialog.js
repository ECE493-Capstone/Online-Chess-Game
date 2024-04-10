import React, { useReducer, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import styled from "styled-components";
import { useEffect } from "react";
import { Button } from "@mui/material";

const DialogContainer = styled.div`
  border: 1px solid white;
  background-color: black;
  border-radius: 10px;
  max-width: 300px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .cancel-button {
    margin-top: 15px;
  }
`;

const QueueDialog = ({
  content = "Finding an opponent",
  showSpinner = true,
  onCancelClicked,
}) => {
  return (
    <DialogContainer id="queue-container">
      <h3>{content}</h3>
      {showSpinner && <CircularProgress size={30} />}
      <Button id="cancel"
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
