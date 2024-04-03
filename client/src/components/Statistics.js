import React, { useState } from "react";
import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"; // Import from 'recharts' instead of '@mui/x-charts'
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 30vw;
  gap: 5vh;
  .select-form {
    width: 40%;
    border: solid 1px #00abe3;
  }
`;

// Sample game mode data. Hard-coded. Once they finish with the API for the actual data, I'll implement them.
const GameStatistics = ({ handleSetData, data, username }) => {
  const [selectedGameMode, setSelectedGameMode] = useState("All");
  const handleGraphData = () => {
    let winCount = 0;
    let tieCount = 0;
    let lossCount = 0;

    data.forEach((entry) => {
      if (entry.winner === username) {
        winCount++;
      } else if (entry.winner === null) {
        tieCount++;
      } else {
        lossCount++;
      }
    });

    return [{ win: winCount, tie: tieCount, lose: lossCount }];
  };
  const graphData = handleGraphData();
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
        width={400}
        height={300}
        data={graphData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="gameMode" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="win" fill="#22a186" name="Win" />
        <Bar dataKey="tie" fill="#D3D3D3" name="Tie" />
        <Bar dataKey="lose" fill="#d54f68" name="Lose" />
      </BarChart>
      <FormControl className="select-form">
        <InputLabel id="demo-simple-select-label">Game Mode</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedGameMode}
          label="Game mode"
          onChange={(e) => {
            setSelectedGameMode(e.target.value);
            handleSetData(e.target.value);
          }}
        >
          <MenuItem value={"All"}>All</MenuItem>
          <MenuItem value={"Standard"}>Standard</MenuItem>
          <MenuItem value={"Blind"}>Blind</MenuItem>
          <MenuItem value={"PowerUp"}>PowerUp</MenuItem>
        </Select>
      </FormControl>
    </PageContainer>
  );
};

export default GameStatistics;
