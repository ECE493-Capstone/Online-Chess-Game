import React, { useReducer, useState } from "react";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import styled from "styled-components";
import { Button } from "@mui/material";

const DialogContainer = styled.div`
  border: 1px solid white;
  background-color: black;
  border-radius: 10px;
  max-width: 400px;
  padding: 10px 0;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    .headerContent {
      margin: 5px 0;
    }
  }

  .body {
    display: flex;
    flex-direction: column;
    padding: 20px;

    .buttons {
      display: flex;
      justify-content: space-evenly;
      margin-top: 20px;
    }
  }
`;

const YesNoDialog = ({
  title = "Draw Request",
  content = "Player A has requested to draw. Do you accept?",
  yesButtonText = "Accept",
  noButtonText = "Decline",
  onYesClicked,
  onNoClicked,
}) => {
  return (
    <DialogContainer>
      <div className="header">
        <h2 className="headerContent">{title}</h2>
      </div>
      <hr />
      <div className="body">
        {content}
        <div className="buttons">
          <Button
            onClick={onYesClicked}
            variant="outlined"
            color="success"
            startIcon={<CheckOutlinedIcon />}
          >
            {yesButtonText}
          </Button>
          <Button
            onClick={onNoClicked}
            variant="outlined"
            color="error"
            startIcon={<CloseOutlinedIcon />}
          >
            {noButtonText}
          </Button>
        </div>
      </div>
    </DialogContainer>
  );
};

export default YesNoDialog;