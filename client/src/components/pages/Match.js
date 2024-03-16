import React from "react";
import Board from "../Board";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

const Match = () => {
  return (
    <Header>
      <>
        <Board />
      </>
    </Header>
  );
};

export default Match;
