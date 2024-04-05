import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import React, {useState, useEffect} from "react";
import styled from "styled-components";
import { fetchUser } from "../api/fetchUser";
import { useNavigate } from "react-router-dom";

const StyledGameReview = styled.div`
  width: 70%;
  margin-top: 50px;
  thead {
    width: 100%;
  }
  tr {
    width: 100%;
    display: flex;
    background-color: #212530;
    &:hover {
      background-color: #1c1e25 !important;
    }
  }
  .title {
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: #15181f;
  }
  .data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    a {
      text-decoration: none;
      color: #22a186;
    }
  }
  .users {
    min-width: 150px;
    width: 70%;
  }
  .scores {
    width: 10%;
  }
  .link {
    width: 30%;
    align-items: center;
  }
`;
const GameReview = ({ data, username, userId }) => {

  const [opponentId, setOpponentId] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [updatedData, setUpdatedData] = useState([]);

  const navigate = useNavigate();

  const handleListItemSelect = (game) => {
    console.log('Navigating to game reivew with: ' + game.mode);
    // Navigate to GameReview component and pass selected game as a prop
    navigate('/profile/gamemovesreview', { state: { game } });
  };

  const getOpponentName = async (opponentId) => {
    try {
      const response = await fetchUser(opponentId);
      const userData = response.data;

      if (response.status === 200) {
        const { username } = userData;
        return username;
      } else {
        console.log("Failed to fetch opponent data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const updatedData = await Promise.all(data.map(async (game) => {
        let newPlayer1 = "";
        let newPlayer2 = "";
        let newWinner = "";

        if (game.player1 === userId) {
          newPlayer1 = username;
        } else {
          const player1 = await getOpponentName(game.player1);
          newPlayer1 = player1;
        }

        if (game.player2 === userId) {
          newPlayer2 = username;
        } else {
          const player2 = await getOpponentName(game.player2);
          newPlayer2 = player2;
        }

        if (game.winner === userId) {
          newWinner = username;
        } else {
          const winner = await getOpponentName(game.winner);
          newWinner = winner;
        }

        return {
          ...game,
          player1: newPlayer1,
          player2: newPlayer2,
          winner: newWinner,
        };
      }));

      setUpdatedData(updatedData);
    };

    fetchData();
  }, [data, userId, username]);  

  return (
    <StyledGameReview>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableBody>
            <TableRow>
              <TableCell className="title">Completed games</TableCell>
            </TableRow>
            {updatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} style={{fontStyle: "italic"}}>
                  No games found
                </TableCell>
              </TableRow>
            ) : (
              updatedData.map((game) => (
                <TableRow hover key={game.move}>
                  <TableCell className="data users" rowSpan={2}>
                    <span>{game.player1}</span>
                    <span>{game.player2}</span>

                  </TableCell>
                  <TableCell className="data scores" rowSpan={2}>
                  <span>{game.winner === game.player1 ? 1 : 0}</span>
                    <span>{game.winner === game.player2 ? 1 : 0}</span>
                  </TableCell>
                  <TableCell className="data link" rowSpan={2}>
                  <a href="/">Review</a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledGameReview>
  );
};

export default GameReview;
