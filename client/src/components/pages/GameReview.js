import React, { useState, useEffect } from 'react';
import { Typography, Box, IconButton } from '@mui/material';
import { useLocation } from "react-router-dom";
import Header from "../Header";
import Board from "../Board.js";
import styled from "styled-components";
import PersonIcon from '@mui/icons-material/Person';
import ReviewMoveHistory from "../ReviewMoveHistory";
import { WHITE, BLACK } from "../../models/Chessboard.js";

const PageContainer = styled.div`
  display: flex;
  background-color: rgb(184, 184, 184);
  min-height: 100vh;
`;

const GameReview = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { game } = useLocation().state;
    const [currentMove, setCurrentMove] = useState("");

    console.log(game.name);

    // Sample game moves:


    const sampleGameMoves = [
        {
            move: 1,
            [WHITE]: {
                from: [6, 4],
                to: [4, 4],
            },
            [BLACK]: {
                from: [1, 4],
                to: [3, 4],
            },
        },
        {
            move: 2,
            [WHITE]: {
                from: [7, 1],
                to: [5, 1],
            },
            [BLACK]: {
                from: [0, 6],
                to: [2, 5],
            },
        },
        {
            move: 3,
            [WHITE]: {
                from: [7, 6],
                to: [5, 5],
            },
            [BLACK]: {
                from: [0, 1],
                to: [2, 2],
            },
        },
        {
            move: 4,
            [WHITE]: {
                from: [6, 3],
                to: [4, 3],
            },
            [BLACK]: {
                from: [1, 3],
                to: [3, 3],
            },
        },
        {
            move: 5,
            [WHITE]: {
                from: [7, 5],
                to: [6, 4],
            },
            [BLACK]: {
                from: [0, 2],
                to: [1, 3],
            },
        },
    ]

    const handleButtonClick = (label) => {
        console.log(`${label} clicked`);
    };

    return (
        <Header setOthersIsLoggedIn={setIsLoggedIn}>
           <PageContainer>
                {isLoggedIn ? (
                    <React.Fragment>
                        <div style={{ paddingTop: "80px", width: "40%"}}>
                            <Typography variant="h4" gutterBottom>
                                Board
                            </Typography>
                            <Typography variant="h4" gutterBottom>
                                {currentMove}
                            </Typography>
                            {/* <Board game={game}/> */}
                        </div>
                        <div style={{ paddingTop: "80px", paddingLeft: "10px", width:  "40%"}}>
                            <Typography variant="h4" gutterBottom>
                                Game Details
                            </Typography>
                            <Box sx={{ marginBottom: '20px', backgroundColor: "rgb(54, 52, 52)"}}>
                                <Typography variant="h6" gutterBottom>
                                    Game Mode: {game.mode}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Players: <PersonIcon style={{ color: "white" }} /> {game.white} vs <PersonIcon style={{ color: "black" }} />  {game.black}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                <PersonIcon style={{ color: game.winner ? (game.winner === game.white ? "white" : "black") : "grey" }} />
                                  {game.winner ? ` ${game.winner} Won` : ' Tie'}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center'}}>
                                {/* implement the move history that Thomas made */}
                                <ReviewMoveHistory history={sampleGameMoves} setCurrentMove = {setCurrentMove}/>
                            </Box>
                        </div>
                    </React.Fragment>
                ) : (
                    <div style={{ paddingTop: '80px', alignItems: 'center', textAlign: 'center', paddingLeft: "10px" }}>
                        <h1>Please Log in to View this Page.</h1>
                    </div>
                )}
            </PageContainer>
        </Header>
    );
};

export default GameReview;