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
  
        return {
          ...game,
          player1: newPlayer1,
          player2: newPlayer2
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
            {updatedData.map((game) => {
              return (
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
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledGameReview>
  );  
};

export default GameReview;
