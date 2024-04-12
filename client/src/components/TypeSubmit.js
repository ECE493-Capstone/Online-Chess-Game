/*
  This file serves section 3.7.10 Game Modes
*/

import React from "react";
import styled from "styled-components";
import TimeSelect from "./TimeSelect";
import { Button } from "@mui/material";
import SideSelect from "./SideSelect";

const StyledTypeSubmitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .submit-button {
    width: 300px;
    opacity: 1 !important;
  }
`;
const TypeSubmit = ({
  side,
  playType,
  handleSubmit,
  handleTimeControlClick,
  handleSideClick,
}) => {
  return (
    <StyledTypeSubmitContainer>
      <TimeSelect handleTimeControlClick={handleTimeControlClick} />
      {playType === "private game" && (
        <SideSelect side={side} handleSideClick={handleSideClick} />
      )}
      <Button
        variant="filled"
        onClick={handleSubmit}
        style={{ backgroundColor: "#00abe3" }}
        className="submit-button"
      >
        Start Game
      </Button>
    </StyledTypeSubmitContainer>
  );
};

export default TypeSubmit;
