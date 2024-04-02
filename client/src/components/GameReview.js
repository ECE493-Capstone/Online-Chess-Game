import React from "react";
import styled from "styled-components";
import Cookies from "universal-cookie";

const StyledGameReview = styled.div``;
const GameReview = ({ data }) => {
  return (
    <StyledGameReview>
      {data.map((game, index) => (
        <div key={index}>
          <span>{game.white}</span>
          <span>{game.winner === game.white ? 1 : 0}</span>
          <span>{game.black}</span>
          <span>{game.winner === game.black}</span>
        </div>
      ))}
    </StyledGameReview>
  );
};

export default GameReview;
