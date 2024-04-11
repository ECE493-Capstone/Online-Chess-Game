import React, { useEffect, useState, useReducer } from "react";
import Board from "../Board";
import { BLACK, Chessboard, GAME_MODE, WHITE } from "../../models/Chessboard";
import { useDispatch, useSelector } from "react-redux";
import { setGame, setVoteInfo } from "../../features/boardSlice";
import { getOngoingGameInformationByGameId } from "../../api/ongoingGames";
import Cookies from "universal-cookie";
import { useParams } from "react-router-dom";
import { socket } from "../../app/socket";
import toast from "react-hot-toast";
import styled from "styled-components";
import NoticeDialog from "../dialog/NoticeDialog";
import { setIsPlayer } from "../../features/userSlice";
import Timer from "../game-room/Timer";
import ShareIcon from "@mui/icons-material/Share";
import Button from "@mui/material/Button";
import { Snackbar } from "@mui/material";
import RequestButtons from "../game-room/RequestButtons";
import { fetchUser } from "../../api/fetchUser";
import H2H from "../game-room/H2H";
import YesNoDialog from "../dialog/YesNoDialog";
import BlindChess from "../BlindChess/BlindChess";
import BlindChessInstructions from "../BlindChess/BlindChessInstructions";

const Container = styled.div`
  /* border: 1px solid white;
  background-color: black;
  border-radius: 10px;
  max-width: fit-content;
  padding: 10px 10px; */
  display: flex;
  .blind-chess {
    cursor: not-allowed;
    .blind-chess-span {
      width: 100%;
      display: block;
      text-align: center;
    }
  }
  .disabled {
    pointer-events: none;
  }
  .lhs {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 60vw;
    .game-result {
      text-align: center;
      padding: 10px 0px;
      border-radius: 10px;
      font-weight: bold;
    }
    .draw-result {
      background-color: #d3d3d3;
      color: black;
    }
    .win-result {
      background-color: #22a186;
      color: black;
    }
    .loss-result {
      background-color: #ff474c;
      color: black;
    }
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
    justify-content: center;
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

    .voting-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
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
    case "VOTE_TIMER":
      return { ...state, voteTimer: action.payload };
    default:
      return state;
  }
};

const Match = () => {
  // data area
  const game = useSelector((state) => state.board.game);
  const [input, setInput] = React.useState(null);
  const [isOpponentDisconnected, setIsOpponentDisconnected] = useState(false);
  const [blindChessSpan, setBlindChessSpan] = useState("Game started...");
  const { gameId } = useParams();
  const [showShareToast, setShowShareToast] = useState(false);
  const dispatch = useDispatch();
  const isPlayer = useSelector((state) => state.user.isPlayer);
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
    voteTimer: null, // time left to vote (in seconds)
  });
  const voteInfo = useSelector((state) => state.board.voteInfo);
  const cookies = new Cookies();
  const userId = cookies.get("userId");

  const castDuckVote = () => {
    dispatch(
      setVoteInfo({ votedSquare: voteInfo.votedSquare, isAllowed: false })
    );
    const gameClone = new Chessboard(
      game.side,
      game.gameMode,
      game.convertToFEN()
    );
    gameClone.voteDuck(voteInfo.votedSquare[0], voteInfo.votedSquare[1]);
    socket.emit("cast vote", {
      gameRoom: gameId,
      square: voteInfo.votedSquare,
      fen: gameClone.convertToFEN(), // fen if vote comes through
    });
  };
  const getIncrement = () => {
    return matchState.increment;
  };
  useEffect(() => {
    socket.on("voteStart", (startTime) => {
      dispatch(setVoteInfo({ votedSquare: null, isAllowed: true }));
      matchDispatch({ type: "VOTE_TIMER", payload: startTime });
    });

    socket.on("voteTime", (timeLeft) => {
      matchDispatch({ type: "VOTE_TIMER", payload: timeLeft });
    });

    if (isPlayer) {
      // ----------------- socket listeners -----------------
      socket.on("disconnect socket", () => {
        toast("You have been disconnected!");
        socket.disconnect();
      });
      socket.on("oppMove", (input) => {
        setInput(input);
      });
      socket.on("opponent disconnected", (input) => {
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
    } else if (isPlayer === false) {
      socket.emit("join room", gameId);
      socket.on("spectatorMove", (fen) => {
        dispatch(setGame(new Chessboard(WHITE, game.gameMode, fen)));
      });
    }
  }, [isPlayer]);

  useEffect(() => {
    socket.off("voteEnd");
    socket.on("voteEnd", (duckSquare) => {
      dispatch(setVoteInfo({ votedSquare: null, isAllowed: false }));
      matchDispatch({ type: "VOTE_TIMER", payload: null });
      const [row, col] = duckSquare;
      const gameCopy = game.copy();
      gameCopy.voteDuck(row, col);
      dispatch(setGame(gameCopy));
    });

    socket.off("undoBoard");
    socket.on("undoBoard", (fen) => {
      const gameFromFen = new Chessboard(game.side, game.gameMode, fen);
      dispatch(setGame(gameFromFen));
      matchDispatch({ type: "BTN_DISABLED", payload: false });
    });
  }, [game]);

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

      return;
    }
    let orientation = WHITE;
    const fetchGame = async () => {
      const gameInfoData = await getOngoingGameInformationByGameId(gameId);
      const isPlayerVal =
        userId !== undefined &&
        (gameInfoData.player1 === userId || gameInfoData.player2 === userId);
      orientation = !userId || gameInfoData.player1 === userId ? WHITE : BLACK;
      const chessboard = new Chessboard(
        orientation,
        gameInfoData.mode,
        gameInfoData.fen[gameInfoData.fen.length - 1]
      );

      dispatch(setIsPlayer(isPlayerVal));
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
      let opponentInfo, playerInfo;
      if (isPlayerVal) {
        opponentInfo = (await fetchUser(opponentId)).data;
        playerInfo = (await fetchUser(userId)).data;
      } else {
        opponentInfo = (await fetchUser(gameInfoData.player1)).data;
        playerInfo = (await fetchUser(gameInfoData.player2)).data;
        console.log(gameInfoData, opponentInfo, playerInfo);
      }
      const tc = gameInfoData.timeControl.split(" ");
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
          playerTime:
            orientation === WHITE
              ? gameInfoData.player1Time
              : gameInfoData.player2Time,
          opponentTime:
            orientation === BLACK
              ? gameInfoData.player1Time
              : gameInfoData.player2Time,
          increment: incrementInMs,
        },
      });
      socket.emit("start timer", {
        gameRoom: gameId,
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
    socket.emit("game end", {
      gameRoom: gameId,
      winnerId: matchState.opponent.id,
    });
  };

  const onOpponentTimeout = () => {
    console.log("Opponent Timeout");
  };

  const handleBlindChessMove = (text) => {
    setBlindChessSpan(text);
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
            {matchState.endGameInfo !== null && (
              <div
                className={`game-result ${
                  matchState.endGameInfo === "Draw"
                    ? "draw-result"
                    : matchState.endGameInfo === "You won!"
                    ? "win-result"
                    : "loss-result"
                }`}
              >
                {matchState.endGameInfo}
              </div>
            )}
            <>
              <div className="info">
                <h2>{matchState.opponent?.username}</h2>
                {matchState.opponentTime !== null && (
                  <Timer
                    type="opponent"
                    side={game.side === WHITE ? BLACK : WHITE}
                    defaultTime={matchState.opponentTime}
                    isActive={!game.isSameTurn(game.side)}
                    onTimeoutCb={onOpponentTimeout}
                  />
                )}
              </div>
              {/* Is player ? isBlind? No board
                Is player ?  NOT isBlind? show board
                Is spectator? show board
                */}
              {isPlayer && game.gameMode === GAME_MODE.BLIND ? (
                <div className="blind-chess">
                  <h1 style={{ textAlign: "center" }}>
                    You are playing with the{" "}
                    {game.side === "w" ? "WHITE" : "BLACK"} pieces
                  </h1>
                  <span className="blind-chess-span">
                    {blindChessSpan}
                    {game.side !== game.turn ? ". Waiting for opponent..." : ""}
                  </span>
                  <BlindChess
                    game={game}
                    gameId={gameId}
                    handleBlindChessMove={handleBlindChessMove}
                  />
                </div>
              ) : (
                <Board game={game} getIncrement={getIncrement} />
              )}
              <div className="info">
                <h2>{matchState.player?.username}</h2>
                {matchState.playerTime !== null && (
                  <Timer
                    type="player"
                    side={game.side}
                    defaultTime={matchState.playerTime}
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
          {game.gameMode === GAME_MODE.BLIND && <BlindChessInstructions />}
          {isPlayer && (
            <div className="request-btns">
              <RequestButtons
                onUndoClicked={onUndoBtnClicked}
                onDrawClicked={onDrawBtnClicked}
                onResignClicked={onResignBtnClicked}
                isDisabled={matchState.btnDisabled}
              />
            </div>
          )}
          {voteInfo.isAllowed &&
            (!isPlayer ? (
              <div className="voting-info">
                <h3>Click on empty square to vote!</h3>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={voteInfo.votedSquare === null}
                  onClick={() => castDuckVote()}
                >
                  Vote
                </Button>
                {matchState.voteTimer}s left to vote.
              </div>
            ) : (
              <div className="voting-info">
                <h3>Waiting for vote... ({matchState.voteTimer}s left)</h3>
              </div>
            ))}
        </div>
      )}
    </Container>
  );
};

export default Match;
