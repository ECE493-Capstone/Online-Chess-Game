import React from 'react';

// Barebones stuff
const Head2Head = ({ player1, player2 }) => {
  // Sample data (replace with actual data)
  const head2HeadData = {
    wins: {
      [player1]: 5,
      [player2]: 3
    },
    losses: {
      [player1]: 2,
      [player2]: 4
    },
    ties: {
      [player1]: 1,
      [player2]: 2
    }
  };

  return (
    <div>
      <h2>Head to Head Stats</h2>
      <div>
        <p>{player1} vs {player2}</p>
        <p>Wins: {head2HeadData.wins[player1]} - {head2HeadData.wins[player2]}</p>
        <p>Losses: {head2HeadData.losses[player1]} - {head2HeadData.losses[player2]}</p>
        <p>Ties: {head2HeadData.ties[player1]} - {head2HeadData.ties[player2]}</p>
      </div>
    </div>
  );
};

export default Head2Head;
