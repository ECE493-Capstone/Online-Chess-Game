/*
  This file serves the following FRs:
  FR29 - Handle.PieceTextMove
  FR30 - Handle.PieceVoiceMove
*/

import React from "react";
import styled from "styled-components";
import { LETTER_WORDS } from "../../constants/BoardConstants";

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
            <li>{LETTER_WORDS["a"]} for A</li>
            <li>{LETTER_WORDS["b"]} for B</li>
            <li>{LETTER_WORDS["c"]} for C</li>
            <li>{LETTER_WORDS["d"]} for D</li>
            <li>{LETTER_WORDS["e"]} for E</li>
            <li>{LETTER_WORDS["f"]} for F</li>
            <li>{LETTER_WORDS["g"]} for G</li>
            <li>{LETTER_WORDS["h"]} for H</li>
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
