import { ButtonGroup, Table } from "@mui/material";
import React, { useReducer, useState } from "react";
import Button from "@mui/material/Button";
import { WHITE, BLACK } from "../../models/Chessboard.js";
import styled from "styled-components";

const ButtonContainer = styled.div`
  .button {
    margin: 10px 15px;
  }
  .group {
    align-content: center;
    max-width: 300px;
  }

  max-width: 300px;
`;

const RequestButtons = ({
  onUndoClicked,
  onDrawClicked,
  onResignClicked,
  isDisabled,
}) => {
  return (
    <ButtonContainer>
      <ButtonGroup className="group" disabled={isDisabled} color="inherit">
        <Button className="button" variant="contained" onClick={onUndoClicked}>
          Undo
        </Button>

        <Button className="button" variant="contained" onClick={onDrawClicked}>
          Draw
        </Button>

        <Button
          className="button"
          variant="contained"
          onClick={onResignClicked}
        >
          Resign
        </Button>
      </ButtonGroup>
    </ButtonContainer>
  );
};
export default RequestButtons;
