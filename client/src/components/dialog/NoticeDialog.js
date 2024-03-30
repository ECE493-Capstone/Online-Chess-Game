import React, { useReducer, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import styled from "styled-components";

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
    div {
      display: flex;
    }
  }

  .body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
`;

const NoticeDialog = ({
  content = "Waiting for opponent to reconnect...",
  showSpinner = true,
}) => {
  return (
    <DialogContainer>
      <div className="header">
        <div>
          <h2 className="headerContent">Notice</h2>
          <InfoOutlinedIcon />
        </div>
        {showSpinner && <CircularProgress size={30} />}
      </div>
      <hr />
      <div className="body">{content}</div>
    </DialogContainer>
  );
};

export default NoticeDialog;
