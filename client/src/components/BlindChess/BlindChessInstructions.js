import React from "react";
import styled from "styled-components";

const StyledInstructionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffb74d;
  color: black;
  max-width: 350px;
  padding: 25px;
  border-radius: 10px;
`;
const BlindChessInstructions = () => {
  return (
    <StyledInstructionsContainer>
      <h3>Play Chess with just your voice</h3>
      <div className="instructions">
        <p>
          Moves are handled by voice commands in a 'FROM' to 'TO' format. For
          example, to move a pawn from A7 to A5, you can say A7 to A5 or Alpha 7
          to Alpha 5. Alternatively you can also use the text input box to enter
          your moves.
        </p>
        <div className="instructions-letter">
          For the letter notations please use the following words:
          <ul>
            <li>Alpha for A</li>
            <li>Bravo for B</li>
            <li>Charlie for C</li>
            <li>Delta for D</li>
            <li>Echo for E</li>
            <li>Foxtrot for F</li>
            <li>Golf for G</li>
            <li>Hotel for H</li>
          </ul>
        </div>
        <p>
          Additionally you can say: King side Castle or Queen Side Castle for
          castling moves
        </p>
      </div>
    </StyledInstructionsContainer>
  );
};

export default BlindChessInstructions;
