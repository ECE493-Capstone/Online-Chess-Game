import React, { useEffect, useReducer, useRef, useState } from "react";
import styled from "styled-components";
import Board from "../Board";
import { Chessboard } from "../../models/Chessboard";
import Button from "@mui/material/Button";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import IconButton from "@mui/material/IconButton";
import { getPastGamesInfoById } from "../../api/pastGames";
import Header from "../Header";
import { useParams } from "react-router-dom";
import { fetchUser } from "../../api/fetchUser";
import { GAME_MODE } from "../../models/Chessboard";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 20px;
  margin-top: 60px;

  .player {
    margin: 10px;
    color: orange;
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: fit-content;

    .navigator {
      display: flex;
      justify-content: space-evenly;
      width: 100%;

      .btn {
        font-size: 50px;
      }
    }
  }
`;

const GameReview = () => {
  const [game, setGame] = useState(null);
  const [fen, setFen] = useState([null]);
  const [index, setIndex] = useState(0);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const { gameId } = useParams();

  useEffect(() => {
    const STARTING_FEN =
      "RNBQKBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbqkbnr w kqKQ - 0 1";
    const STARTING_FEN_FOR_DUCK =
      "RNBQKBNR/PPPPPPPP/8/8/3D4/8/pppppppp/rnbqkbnr w kqKQ - 0 1";

    const loadData = async () => {
      const data = await getPastGamesInfoById(gameId);
      console.log(data);
      const player1Info = (await fetchUser(data.player1)).data;
      const player2Info = (await fetchUser(data.player2)).data;
      setPlayer1(player1Info.username);
      setPlayer2(player2Info.username);
      if (data.mode === GAME_MODE.POWER_UP_DUCK) {
        setFen([STARTING_FEN_FOR_DUCK, ...data.fen]);
        setGame(new Chessboard("w", data.mode, STARTING_FEN_FOR_DUCK));
      } else {
        setFen([STARTING_FEN, ...data.fen]);
        setGame(new Chessboard("w", data.mode, STARTING_FEN));
      }
    };
    loadData();
  }, [gameId]);

  const onBackClick = () => {
    if (index > 0) {
      const newIndex = index - 1;
      setIndex(newIndex);
      setGame(new Chessboard("w", game.gameMode, fen[newIndex]));
    }
  };

  const onNextClick = () => {
    if (index < fen.length - 1) {
      const newIndex = index + 1;
      setIndex(newIndex);
      setGame(new Chessboard("w", game.gameMode, fen[newIndex]));
    }
  };

  return (
    <>
      <Header>
        <Container>
          <h1>Game Review</h1>
          {game && (
            <div className="content">
              <h2 className="player">{player1}</h2>
              <Board game={game} />
              <h2 className="player">{player2}</h2>
              <div className="navigator">
                <IconButton
                  className="btn"
                  onClick={onBackClick}
                  disabled={!fen || index === 0}
                >
                  <ArrowLeftIcon fontSize="inherit" />
                </IconButton>
                <IconButton
                  className="btn"
                  onClick={onNextClick}
                  disabled={!fen || index === fen.length - 1}
                >
                  <ArrowRightIcon fontSize="inherit" />
                </IconButton>
              </div>
            </div>
          )}
        </Container>
      </Header>
    </>
  );
};

export default GameReview;
