import React, { useEffect, useState, useReducer } from "react";
import Board from "../Board";
import { BLACK, Chessboard, WHITE } from "../../models/Chessboard";
import { useDispatch, useSelector } from "react-redux";
import { setGame } from "../../features/boardSlice";
import { getOngoingGameInformationByGameId } from "../../api/ongoingGames";
import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../app/socket";
import toast from "react-hot-toast";
import styled from "styled-components";
import NoticeDialog from "../dialog/NoticeDialog";
import Timer from "../game-room/Timer";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShareIcon from "@mui/icons-material/Share";
import Button from "@mui/material/Button";
import { Snackbar } from "@mui/material";
import MoveHistory from "../game-room/MoveHistory";
import RequestButtons from "../game-room/RequestButtons";
import { fetchUser } from "../../api/fetchUser";
import H2H from "../game-room/H2H";
import Header from "../Header";
import YesNoDialog from "../dialog/YesNoDialog";

const Container = styled.div`
  /* border: 1px solid white;
  background-color: black;
  border-radius: 10px;
  max-width: fit-content;
  padding: 10px 10px; */
  display: flex;
  .lhs {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 60vw;

    .board {
      display: flex;
      flex-direction: column;
      justify-content: center;
      max-width: fit-content;

      .spectator {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        h3 {
          margin-left: 5px;
          font-size: 1.3rem;
        }
      }
      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0px;

        h2 {
          color: orange;
        }
      }

      .share-btn {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
  .rhs {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 40vw;
    height: 100vh;

    .move-history {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 70%;
    }

    .request-btns {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 70%;
    }
  }
`;

const MatchReducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        player: action.payload.player,
        opponent: action.payload.opponent,
        playerTime: action.payload.playerTime,
        opponentTime: action.payload.opponentTime,
        increment: action.payload.increment,
      };
    case "PLAYER_TIME":
      return { ...state, playerTime: action.payload };
    case "OPPONENT_TIME":
      return { ...state, opponentTime: action.payload };
    case "BTN_DISABLED":
      return { ...state, btnDisabled: action.payload };
    case "END_GAME":
      return { ...state, endGameInfo: action.payload };
    case "DRAW_DIALOG":
      return { ...state, openDrawDialog: action.payload };
    case "UNDO_DIALOG":
      return { ...state, openUndoDialog: action.payload };
    default:
      return state;
  }
};

const Match = () => {
  // data area
  const game = useSelector((state) => state.board.game);
  const [input, setInput] = React.useState(null);
  const [isOpponentDisconnected, setIsOpponentDisconnected] = useState(false);
  const { gameId } = useParams();
  const [showShareToast, setShowShareToast] = useState(false);
  const dispatch = useDispatch();

  const [matchState, matchDispatch] = useReducer(MatchReducer, {
    player: null,
    opponent: null,
    playerTime: null,
    opponentTime: null,
    increment: null,
    btnDisabled: false,
    endGameInfo: null,
    openDrawDialog: false,
    openUndoDialog: false,
  });
  const cookies = new Cookies();
  const userId = cookies.get("userId");
  const navigate = useNavigate();
  console.log(game);
  useEffect(() => {
    if (game) {
      if (input !== null) {
        const gameCopy = game.copy();
        gameCopy.playOpponentMove(input);
        dispatch(setGame(gameCopy));
        setInput(null);

        if (gameCopy.isEnded) {
          socket.emit("game end", {
            gameRoom: gameId,
            winnerId: gameCopy.winner
              ? gameCopy.winner === gameCopy.side
                ? matchState.player.id
                : matchState.opponent.id
              : null,
          });
        }
      }
      socket.on("undoBoard", (fen) => {
        const gameFromFen = new Chessboard(game.side, game.gameMode, fen);
        dispatch(setGame(gameFromFen));
        matchDispatch({ type: "BTN_DISABLED", payload: false });
      });

      return;
    }
    if (userId) {
      // ----------------- socket listeners -----------------
      socket.on("oppMove", (input) => {
        console.log("input", input);
        setInput(input);
      });
      socket.on("opponent disconnected", (input) => {
        console.log("WTF");
        setIsOpponentDisconnected(true);
        toast.error("Opponent Disconnected!");
      });
      socket.on("opponent reconnected", (input) => {
        setIsOpponentDisconnected(false);
        toast.success("Opponent Reconnected!");
      });
      socket.on("opponent abandoned", (input) => {
        setIsOpponentDisconnected(false);
        toast.error("Opponent Abandoned the game!");
      });
      socket.on("game result", (winnerId) => {
        matchDispatch({ type: "BTN_DISABLED", payload: true });
        if (winnerId === null) {
          matchDispatch({
            type: "END_GAME",
            payload: "Draw",
          });
        } else {
          matchDispatch({
            type: "END_GAME",
            payload: winnerId === userId ? "You won!" : "You lost!",
          });
        }
      });

      // draw stuff
      socket.on("oppDrawRequest", () => {
        matchDispatch({ type: "DRAW_DIALOG", payload: true });
      });

      socket.on("drawRejected", () => {
        matchDispatch({ type: "BTN_DISABLED", payload: false });
      });

      // undo stuff
      socket.on("oppUndoRequest", () => {
        matchDispatch({ type: "UNDO_DIALOG", payload: true });
      });

      socket.on("undoRejected", () => {
        matchDispatch({ type: "BTN_DISABLED", payload: false });
      });
      // ----------------------------------------------------
    }
    // if (!userId) {
    //   navigate("/test");
    // }
    let orientation = WHITE;
    const fetchGame = async () => {
      const gameInfoData = await getOngoingGameInformationByGameId(gameId);
      orientation = !userId || gameInfoData.player1 === userId ? WHITE : BLACK;
      const chessboard = new Chessboard(
        orientation,
        gameInfoData.mode,
        gameInfoData.fen[gameInfoData.fen.length - 1]
      );
      dispatch(setGame(chessboard));

      // handle undo when game variable is not set (a.k.a. 1st move)
      socket.on("undoBoard", (fen) => {
        const gameFromFen = new Chessboard(
          chessboard.side,
          chessboard.gameMode,
          fen
        );
        dispatch(setGame(gameFromFen));
        matchDispatch({ type: "BTN_DISABLED", payload: false });
      });

      const opponentId =
        gameInfoData.player1 === userId
          ? gameInfoData.player2
          : gameInfoData.player1;
      const opponentInfo = (await fetchUser(opponentId)).data;
      console.log(opponentInfo);
      const playerInfo = (await fetchUser(userId)).data;
      const tc = gameInfoData.timeControl.split(" ");
      const initTimeInMs = parseInt(tc[0]) * 1000 * 60;
      const incrementInMs = parseInt(tc[2]) * 1000;
      matchDispatch({
        type: "INIT",
        payload: {
          player: {
            id: userId,
            ...playerInfo,
          },
          opponent: {
            id: opponentId,
            ...opponentInfo,
          },
          playerTime: initTimeInMs,
          opponentTime: initTimeInMs,
          increment: incrementInMs,
        },
      });
    };
    fetchGame();
  }, [input]);

  const copyUrlToClipboard = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(
        // display toast
        () => {
          console.log("URL copied to clipboard");
          setShowShareToast(true);
        }
      )
      .catch((error) => {
        console.log("Failed to copy URL to clipboard", error);
      });
  };

  const onUndoBtnClicked = () => {
    console.log("Undo clicked");
    matchDispatch({ type: "BTN_DISABLED", payload: true });
    socket.emit("undo request", {
      gameRoom: gameId,
    });
  };

  const onDrawBtnClicked = () => {
    console.log("Draw clicked");
    matchDispatch({ type: "BTN_DISABLED", payload: true });
    socket.emit("draw request", { gameRoom: gameId });
  };

  const onResignBtnClicked = () => {
    console.log("Resign clicked");
    matchDispatch({ type: "BTN_DISABLED", payload: true });
    socket.emit("resign", {
      gameRoom: gameId,
      winnerId: matchState.opponent.id,
    });
  };

  const onPlayerTimeout = () => {
    console.log("Player Timeout");
  };

  const onOpponentTimeout = () => {
    console.log("Opponent Timeout");
  };

  return (
    <Container>
      {showShareToast && (
        <Snackbar
          open={showShareToast}
          autoHideDuration={1500}
          onClose={() => setShowShareToast(false)}
          message="URL copied to clipboard"
        />
      )}

      <div className="lhs">
        {game ? (
          <div className="board">
            {/* {numSpectators > 0 && (
              <div className="spectator">
                <VisibilityIcon />
                <h3>{numSpectators}</h3>
              </div>
            )} */}
            {matchState.endGameInfo === null ? (
              <>
                <div className="info">
                  <h2>{matchState.opponent?.username}</h2>
                  {matchState.opponentTime !== null && (
                    <Timer
                      initTimeInMs={matchState.opponentTime}
                      isActive={!game.isSameTurn(game.side)}
                      onTimeoutCb={onOpponentTimeout}
                    />
                  )}
                </div>
                <Board game={game} />
                <div className="info">
                  <h2>{matchState.player?.username}</h2>
                  {matchState.playerTime !== null && (
                    <Timer
                      initTimeInMs={matchState.playerTime}
                      isActive={game.isSameTurn(game.side)}
                      onTimeoutCb={onPlayerTimeout}
                    />
                  )}
                </div>
                <div className="share-btn">
                  <Button
                    onClick={copyUrlToClipboard}
                    variant="contained"
                    color="info"
                  >
                    {<ShareIcon />}
                  </Button>
                </div>
                {matchState.openDrawDialog && (
                  <YesNoDialog
                    title="Draw Request"
                    content={`${matchState.opponent.username} has requested a draw. Do you accept?`}
                    onYesClicked={() => {
                      socket.emit("reply draw request", {
                        gameRoom: gameId,
                        accepted: true,
                      });
                      matchDispatch({ type: "DRAW_DIALOG", payload: false });
                    }}
                    onNoClicked={() => {
                      socket.emit("reply draw request", {
                        gameRoom: gameId,
                        accepted: false,
                      });
                      matchDispatch({ type: "DRAW_DIALOG", payload: false });
                    }}
                  ></YesNoDialog>
                )}
                {matchState.openUndoDialog && (
                  <YesNoDialog
                    title="Undo Request"
                    content={`${matchState.opponent.username} has requested an undo. Do you accept?`}
                    onYesClicked={() => {
                      socket.emit("reply undo request", {
                        gameRoom: gameId,
                        accepted: true,
                      });
                      matchDispatch({ type: "UNDO_DIALOG", payload: false });
                    }}
                    onNoClicked={() => {
                      socket.emit("reply undo request", {
                        gameRoom: gameId,
                        accepted: false,
                      });
                      matchDispatch({ type: "UNDO_DIALOG", payload: false });
                    }}
                  ></YesNoDialog>
                )}
              </>
            ) : (
              <div>{matchState.endGameInfo}</div>
            )}
          </div>
        ) : (
          <NoticeDialog content="Waiting for opponent..." />
        )}
      </div>
      {isOpponentDisconnected && (
        <NoticeDialog content="Opponent Disconnected" />
      )}
      {game && (
        <div className="rhs">
          <div>
            <H2H
              player1Id={matchState.player?.id}
              player2Id={matchState.opponent?.id}
            />
          </div>
          <div className="move-history">
            <MoveHistory />
          </div>
          <div className="request-btns">
            <RequestButtons
              onUndoClicked={onUndoBtnClicked}
              onDrawClicked={onDrawBtnClicked}
              onResignClicked={onResignBtnClicked}
              isDisabled={matchState.btnDisabled}
            />
          </div>
        </div>
      )}
    </Container>
  );
};

export default Match;
