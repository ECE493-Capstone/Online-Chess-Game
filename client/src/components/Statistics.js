
import React from 'react';

// This is going to be the sample JSOn structure that will be saved.
// {
//     "gameModes": [
//       {
//         "name": "Classic",
//         "fields": [
//           { "name": "Win", "count": 0 },
//           { "name": "Lose", "count": 0 },
//           { "name": "Tie", "count": 0 }
//         ]
//       },
//       {
//         "name": "Blind",
//         "fields": [
//           { "name": "Win", "count": 0 },
//           { "name": "Lose", "count": 0 },
//           { "name": "Tie", "count": 0 }
//         ]
//       },
//       {
//         "name": "Power-Up",
//         "fields": [
//           { "name": "Win", "count": 0 },
//           { "name": "Lose", "count": 0 },
//           { "name": "Tie", "count": 0 }
//         ]
//       }
//     ]
//   }

const Statistics = ({ gamesPlayed, wins, losses, draws }) => {
  return (
    <div>
      <h2>Statistics</h2>
      <p>Games Played: {gamesPlayed}</p>
      <p>Wins: {wins}</p>
      <p>Losses: {losses}</p>
      <p>Draws: {draws}</p>
    </div>
  );
};

export default Statistics;
