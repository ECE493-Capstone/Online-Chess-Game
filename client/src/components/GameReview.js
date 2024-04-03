import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import React from "react";
import styled from "styled-components";

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
const GameReview = ({ data, username }) => {
  return (
    <StyledGameReview>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableBody>
            <TableRow>
              <TableCell className="title">Completed games</TableCell>
            </TableRow>
            {data.map((game) => {
              const player1 = game.player1 === "" ? username : game.player1;
              const player2 = game.player2 === "" ? username : game.player2;
              return (
                <TableRow hover key={game.move}>
                  <TableCell className="data users" rowSpan={2}>
                    <span>{player1}</span>
                    <span>{player2}</span>
                  </TableCell>
                  <TableCell className="data scores" rowSpan={2}>
                    <span>{game.winner === player1 ? 1 : 0}</span>
                    <span>{game.winner === player2 ? 1 : 0}</span>
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
