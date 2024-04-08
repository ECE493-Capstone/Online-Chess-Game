import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { RiUserVoiceFill } from "react-icons/ri";
import { Chessboard } from "../../models/Chessboard";
import { CHESS_LETTERS, LETTER_WORDS } from "../../constants/BoardConstants";
import Fuse from "fuse.js";
import Dictaphone2 from "../Dictaphone2";
import { useDispatch } from "react-redux";
import { socket } from "../../app/socket";
import { setGame } from "../../features/boardSlice";

const StyledBlindChessContainer = styled.div`
  display: flex;
  > div {
    padding: 100px;
  }
  .voice-input {
    display: flex;
    flex-direction: column;
    align-items: center;
    .recognized-move {
      margin-bottom: 20px;
    }
  }
  .text-button-input {
    border-right: solid 0.5px white;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 50%;
    .buttons-container {
      margin: 20px;
      display: flex;
      flex-wrap: wrap;
      max-width: 70%;
      justify-content: center;
      gap: 10px;
    }
  }
  input {
    height: 100%;
    text-align: center;
  }
  .selected {
    background-color: #00abe3 !important;
  }
`;

const BlindChess = ({ game, gameId, handleBlindChessMove }) => {
  const [legalMoves, setLegalMoves] = useState([]);
  const [inputLegalMoves, setInputLegalMoves] = useState([]);
  const [input, setInput] = useState("");
  const [selectedButton, setSelectedButton] = useState(null);
  const [recognizedMove, setRecognizedMove] = useState("");
  const dispatch = useDispatch();
  const getLegalMoves = () => {
    const moves = game.legalMoves;
    console.log(moves);
    const keys = Object.keys(moves);
    const lMoves = [];
    for (let i = 0; i < keys.length; i++) {
      let keyPair = keys[i].padStart(2, "0").split("");
      for (let j = 0; j < moves[keys[i]].length; j++) {
        let xmove = moves[keys[i]][j];
        console.log(keyPair, xmove);
        lMoves.push({
          id: i * 10 + j,
          move: {
            fromRow: parseInt(keyPair[0]),
            fromCol: parseInt(keyPair[1]),
            toRow: parseInt(xmove[0]),
            toCol: parseInt(xmove[1]),
          },
          name: `${CHESS_LETTERS[keyPair[1]]}${7 - parseInt(keyPair[0]) + 1} ${
            CHESS_LETTERS[xmove[1]]
          }${7 - xmove[0] + 1}`,
          voiceNotation1: `${LETTER_WORDS[CHESS_LETTERS[keyPair[1]]]} ${
            7 - parseInt(keyPair[0]) + 1
          } to ${LETTER_WORDS[CHESS_LETTERS[xmove[1]]]} ${xmove[0] + 1}`,
          voiceNotation2: `${CHESS_LETTERS[keyPair[1]]} ${
            7 - parseInt(keyPair[0]) + 1
          } to ${CHESS_LETTERS[xmove[1]]} ${7 - xmove[0] + 1}`,
        });
      }
    }
    console.log(lMoves);
    setLegalMoves(lMoves);
  };

  const getLegalMovesFromInput = () => {
    const options = { keys: ["name"] };
    const fuse = new Fuse(legalMoves, options);
    const result = fuse.search(input);
    console.log(legalMoves, result);
    setInputLegalMoves(result.map((move) => move.item));
  };

  const handleSetMove = (move) => {
    setRecognizedMove(move);
  };
  const fetchMoves = () => {
    let validMoveVoice = [];
    legalMoves.forEach((move) => {
      validMoveVoice.push(move.voiceNotation1);
      validMoveVoice.push(move.voiceNotation2);
    });
    console.log(validMoveVoice);
    return validMoveVoice;
  };

  const handleMovePiece = (move) => {
    console.log(move);
    if (move) {
      handleBlindChessMove(`You played ${move.voiceNotation2}`);
      const gameCopy = game.copy();
      console.log(gameCopy.convertToFEN());
      gameCopy.playYourMove(move.move);
      dispatch(setGame(gameCopy));
      socket.emit("move piece", {
        gameRoom: gameId,
        input: move.move,
        fen: gameCopy.convertToFEN(),
      });
    }
  };

  useEffect(() => {
    getLegalMoves();
  }, [game]);

  useEffect(() => {
    fetchMoves();
  }, [legalMoves]);

  useEffect(() => {
    console.log("WORKING");
    getLegalMovesFromInput();
  }, [input]);

  return (
    <StyledBlindChessContainer
      className={game.turn !== game.side ? "disabled" : ""}
    >
      <div className="text-button-input">
        <TextField
          variant="filled"
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="buttons-container">
          {inputLegalMoves.slice(0, 7).map((move) => (
            <Button
              key={move.id}
              className={selectedButton?.id === move.id ? "selected" : ""}
              variant="outlined"
              onClick={() => {
                setSelectedButton(move);
              }}
            >
              {move.name}
            </Button>
          ))}
        </div>
        <Button
          variant="contained"
          onClick={() => {
            handleMovePiece(selectedButton);
          }}
        >
          Make Button Move
        </Button>
      </div>
      <div className="voice-input">
        <RiUserVoiceFill size={50} />
        <Dictaphone2 getVoiceMoves={fetchMoves} handleSetMove={handleSetMove} />
        <div className="recognized-move">{recognizedMove?.voiceNotation2}</div>
        <div className="submit-input">
          <Button
            variant="contained"
            onClick={() => handleMovePiece(recognizedMove)}
          >
            Make Voice Move
          </Button>
        </div>
      </div>
    </StyledBlindChessContainer>
  );
};

export default BlindChess;
