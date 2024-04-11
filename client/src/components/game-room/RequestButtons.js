import { ButtonGroup, Table } from "@mui/material";
import React, { useReducer, useState } from "react";
import Button from "@mui/material/Button";
import { WHITE, BLACK } from "../../models/Chessboard.js";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import styled from "styled-components";

const ButtonContainer = styled.div`
  max-width: 100%;
  .button {
    margin: 10px 12px;
  }
  .group {
    max-width: 100%;
  }
`;

const RequestButtons = ({
  onUndoClicked,
  onDrawClicked,
  onResignClicked,
  isDisabled,
}) => {
  return (
    <ButtonContainer>
      <ButtonGroup className="group" disabled={isDisabled} color="warning">
        <Button
          className="button"
          variant="contained"
          onClick={onUndoClicked}
          startIcon={<UndoOutlinedIcon />}
        >
          Undo
        </Button>

        <Button
          className="button"
          variant="contained"
          onClick={onDrawClicked}
          startIcon={<HandshakeOutlinedIcon />}
        >
          Draw
        </Button>

        <Button
          id="resign-button"
          className="button"
          variant="contained"
          onClick={onResignClicked}
          startIcon={<FlagOutlinedIcon />}
        >
          Resign
        </Button>
      </ButtonGroup>
    </ButtonContainer>
  );
};
export default RequestButtons;
