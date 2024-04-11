import React, { useState, useEffect } from 'react';
import { MenuItem, Button, ButtonGroup, MenuList, Paper, Popper, Grow, ClickAwayListener, FormControl, InputLabel, Select } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'; // Import from 'recharts' instead of '@mui/x-charts'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import styled from "styled-components";
import { getPastGamesInformation } from '../api/pastGames';

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  gap: 5vh;
  .select-form {
    width: 40%;
    border: solid 1px #00abe3;
  }
`;

// Sample game mode data. Hard-coded. Once they finish with the API for the actual data, I'll implement them.
const GameStatistics = ({ handleSetData, data, userId }) => {
  // console.log("Data retreived into stats: " + JSON.stringify(data));
  const [selectedGameMode, setSelectedGameMode] = useState("All");
  const [formattedData, setFormattedData] = useState([]);

  useEffect(() => {

    const handleGraphData = () => {
      let winCountWhite = 0;
      let winCountBlack = 0;
      let tieCountWhite = 0;
      let tieCountBlack = 0;
      let lossCountWhite = 0;
      let lossCountBlack = 0;
  
  
      data.forEach((entry) => {
        if (entry.winner ===  userId) {
          if (entry.player1 ===  userId) {
            winCountWhite++;
          }
          else {
            winCountBlack++;
          }
        } else if (entry.winner === null) {
          if (entry.player1 === userId) {
            tieCountWhite++;
          }
          else {
            tieCountBlack++;
          }
        } else {
          if (entry.player1 === userId) {
            lossCountWhite++;
          }
          else {
            lossCountBlack++;
          }
        }
      });
      
      // console.log("Final values attained: " + win)
      return [{ winWhite: winCountWhite, winBlack: winCountBlack, tieWhite: tieCountWhite, tieBlack: tieCountBlack, loseWhite: lossCountWhite, loseBlack: lossCountBlack }];
    };

    const formatGameData = (gameData) => {
      console.log("gamedata: " + JSON.stringify(gameData[0]));
      const formattedData = [
          { name: "Wins", white: gameData[0].winWhite, black: gameData[0].winBlack },
          { name: "Losses", white: gameData[0].loseWhite, black: gameData[0].loseBlack },
          { name: "Ties", white: gameData[0].tieWhite, black: gameData[0].tieBlack }
      ];
  
      setFormattedData(formattedData);
    }

    const graphData = handleGraphData();
    
    formatGameData(graphData);
    

  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "5px",
            border: "1px solid #ccc",
          }}
        >
          {payload.map((entry, index) => (
            <p
              key={`tooltip-${index}`}
              style={{ color: "black", margin: "0" }}
            >{`${entry.name} : ${entry.value}`}</p>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <PageContainer>
      <BarChart
        id = "game-statistics"
        width={400}
        height={300}
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="white" fill="white" name="White" stackId="white" id="white"/>
        <Bar dataKey="black" fill="#9e9fa0" name="Black" stackId="black" id="black"/>
      </BarChart>
      <FormControl className="select-form">
        <InputLabel id="demo-simple-select-label">Game Mode</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedGameMode}
          label="Game mode"
          onChange={(e) => {
            const selectedMode = e.target.value;
            setSelectedGameMode(selectedMode);
            console.log("Selected Game Mode: " + selectedMode);
            handleSetData(selectedMode);
          }}
        >
          <MenuItem id="all" value={"All"}>All</MenuItem>
          <MenuItem id="standard" value={"Standard"}>Standard</MenuItem>
          <MenuItem id="blind" value={"Blind"}>Blind</MenuItem>
          <MenuItem id="powerupduck" value={"Power-up Duck"}>Power-up Duck</MenuItem>
        </Select>
      </FormControl>
    </PageContainer>
  );
};

export default GameStatistics;