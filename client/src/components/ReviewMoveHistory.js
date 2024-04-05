import { Table, Box, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { WHITE, BLACK } from "../models/Chessboard.js";
import styled from "styled-components";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LastPageIcon from '@mui/icons-material/LastPage';

const Container = styled.div`
  align-content: center;
  border: 1px solid white;
  border-radius: 5px;
  display: flex;
  max-width: 350px;
  max-height: 75vh;
  .black {
    color: gray;
  }
  .move {
    color: orange
  }
`;

function convertToSquare(row, col) {
  let rowNumber = (8 - parseInt(row)).toString();
  let colNumber = String.fromCharCode(97 + parseInt(col)); // 97 is the ASCII value for 'a'
  return colNumber + rowNumber;
}

const ReviewMoveHistory = ({ history, setCurrentMove}) => {

    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [turnIsWhite, setTurnIsWhite] = useState(true);

    const handleNextMoveButtonClick = () => {
        console.log("Next move clicked.");
        if (turnIsWhite || currentMoveIndex != history.length - 1) {
            if (!turnIsWhite) {
                setCurrentMoveIndex(prevIndex => Math.min(prevIndex + 1, history.length - 1));
            }
            setTurnIsWhite(prevTurn => !prevTurn);
        }
        else {
            console.log("End of moves reached.");
        }
    };

    const handlePreviousMoveButtonClick = () => {
        console.log("Previous move clicked.");
        if (!turnIsWhite || currentMoveIndex != 0) {
            if (turnIsWhite) {
                setCurrentMoveIndex(prevIndex => Math.max(prevIndex - 1, 0));
            }
            setTurnIsWhite(prevTurn => !prevTurn);
        }
        else {
            console.log("start of moves reached.");
        }
    };

    const handleFirstMoveButtonClick = () => {
        console.log("First move clicked.");
        setCurrentMoveIndex(0);
        setTurnIsWhite(true);
    };

    const handleLastMoveButtonClick = () => {
        console.log("Last move clicked.");
        setCurrentMoveIndex(history.length - 1);
        setTurnIsWhite(false); // How do we detect last turn if the last turn is white?
    };

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

    useEffect(() => {
        const currentTurn = turnIsWhite ? "White" : "Black";
        const currentMove = history[currentMoveIndex];
        const thisMove = turnIsWhite ? currentMove[WHITE] : currentMove[BLACK];
        setCurrentMove(`${currentTurn}: ${thisMove.from} to ${thisMove.to}`);
    }, [currentMoveIndex, turnIsWhite, history]);


  console.log("This is the history retreived: " + history);

  // history = Array.from({ length: 50 }, () => fakeData).flat();
  return (
    <div>
        <Container>
            <TableContainer component={Paper}>
                <Table stickyHeader>
                <TableHead>
                    <TableRow>
                    <TableCell className="move">Move </TableCell>
                    <TableCell colSpan={2}>White</TableCell>
                    <TableCell colSpan={2} className="black">Black</TableCell>
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
                    {history.map((turn, index) => {
                    {/* console.log("This is a trun: " + turn); */}
                    const wMove = turn[WHITE];
                    const bMove = turn[BLACK];
                    const isCurrentMove = index === currentMoveIndex;

                    return (
                        <TableRow hover key={turn.move}>
                        <TableCell className="move">{turn.move}</TableCell>
                        <TableCell style={isCurrentMove && turnIsWhite ? { backgroundColor: 'rgb(54, 52, 52)' } : {}}>
                            {convertToSquare(wMove.from[0], wMove.from[1])}
                        </TableCell>
                        <TableCell style={isCurrentMove && turnIsWhite ? { backgroundColor: 'rgb(54, 52, 52)' } : {}}>
                            {wMove.promotion
                            ? convertToSquare(wMove.to[0], wMove.to[1]) +
                                `=${wMove.promotion}`
                            : convertToSquare(wMove.to[0], wMove.to[1])}
                        </TableCell>
                        <TableCell className="black" style={isCurrentMove && !turnIsWhite ? { backgroundColor: 'rgb(54, 52, 52)' } : {}}>
                            {convertToSquare(bMove.from[0], bMove.from[0])}
                        </TableCell>
                        <TableCell className="black" style={isCurrentMove && !turnIsWhite ? { backgroundColor: 'rgb(54, 52, 52)' } : {}}>
                            {convertToSquare(bMove.to[1], bMove.to[1])}
                        </TableCell>
                        </TableRow>
                    );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
        </Container>
        <Box sx={{ display: 'flex', justifyContent: 'center'}}>
                <IconButton aria-label="First Page" onClick={() => handleFirstMoveButtonClick()}>
                    <FirstPageIcon fontSize="large"/>
                </IconButton>
                <IconButton aria-label="Previous Page" onClick={() => handlePreviousMoveButtonClick()}>
                    <ArrowBackIosIcon />
                </IconButton>
                <IconButton aria-label="Next Page" onClick={() => handleNextMoveButtonClick()}>
                    <ArrowForwardIosIcon />
                </IconButton>
                <IconButton aria-label="Last Page" onClick={() => handleLastMoveButtonClick()}>
                    <LastPageIcon fontSize="large" />
                </IconButton>
        </Box>
    </div>

  );
};
export default ReviewMoveHistory;