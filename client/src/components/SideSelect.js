import React from "react";
import { FaChessKing } from "react-icons/fa6";
import { FaRandom } from "react-icons/fa";
import styled from "styled-components";
import { Button } from "@mui/material";
const StyledSideSelectContainer = styled.div`
  display: flex;
  background-color: rgb(0, 171, 227, 0.5);
  margin-bottom: 30px;
  align-items: center;
  button {
    height: 100%;
    width: 100%;
    opacity: 1 !important;
    font-size: 30px;
    padding: 20px;
    &:hover {
      background-color: rgb(0, 171, 227, 1);
    }
  }
  .selected {
    background-color: rgb(0, 171, 227, 1);
  }
  .white {
    color: white;
  }
  .black {
    color: black;
  }
  .random {
    color: white;
  }
`;
const SideSelect = ({ side, handleSideClick }) => {
  return (
    <StyledSideSelectContainer>
      <Button
        id="play-as-white"
        className={`white ${side === "w" ? "selected" : ""}`}
        title="Play as white"
        onClick={() => handleSideClick("w")}
      >
        <FaChessKing />
      </Button>
      <Button
        id="play-as-black"
        className={`black ${side === "b" ? "selected" : ""}`}
        title="Play as black"
        onClick={() => handleSideClick("b")}
      >
        <FaChessKing />
      </Button>
      <Button
        className={`random ${side === "r" ? "selected" : ""}`}
        title="Choose random"
        onClick={() => handleSideClick("r")}
      >
        <FaRandom />
      </Button>
    </StyledSideSelectContainer>
  );
};

export default SideSelect;
