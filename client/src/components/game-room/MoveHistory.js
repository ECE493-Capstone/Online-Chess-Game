import { Table } from "@mui/material";
import React, { useReducer, useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { WHITE, BLACK } from "../../models/Chessboard.js";
import styled from "styled-components";

const Container = styled.div`
  align-content: center;
  border: 1px solid white;
  border-radius: 5px;
  display: flex;
  max-height: 70vh;

  .black {
    color: gray;
  }

  .move {
    color: orange;
  }
`;

function convertToSquare(row, col) {
  let rowNumber = (8 - parseInt(row)).toString();
  let colNumber = String.fromCharCode(97 + parseInt(col)); // 97 is the ASCII value for 'a'
  return colNumber + rowNumber;
}

const MoveHistory = ({ history }) => {
  const fakeData = [
    {
      move: 1,
      [WHITE]: {
        from: [6, 0],
        to: [4, 0],
      },
      [BLACK]: {
        from: [1, 0],
        to: [3, 0],
      },
    },
    {
      move: 2,
      [WHITE]: {
        from: [6, 1],
        to: [4, 1],
        promotion: "Q",
      },
      [BLACK]: {
        from: [1, 1],
        to: [3, 1],
      },
    },
  ];

  history = Array.from({ length: 50 }, () => fakeData).flat();
  return (
    <Container>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className="move">Move </TableCell>
              <TableCell colSpan={2}>White</TableCell>
              <TableCell colSpan={2} className="black">
                Black
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell className="black">From</TableCell>
              <TableCell className="black">To</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((turn) => {
              const wMove = turn[WHITE];
              const bMove = turn[BLACK];

              return (
                <TableRow hover key={turn.move}>
                  <TableCell className="move">{turn.move}</TableCell>
                  <TableCell>
                    {convertToSquare(wMove.from[0], wMove.from[1])}
                  </TableCell>
                  <TableCell>
                    {wMove.promotion
                      ? convertToSquare(wMove.to[0], wMove.to[1]) +
                        `=${wMove.promotion}`
                      : convertToSquare(wMove.to[0], wMove.to[1])}
                  </TableCell>
                  <TableCell className="black">
                    {convertToSquare(bMove.from[0], bMove.from[0])}
                  </TableCell>
                  <TableCell className="black">
                    {convertToSquare(bMove.to[1], bMove.to[1])}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
export default MoveHistory;
