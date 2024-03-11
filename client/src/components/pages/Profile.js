import React from 'react';

const Profile = ({ username, email, statistics }) => {
    return (
      <div className="profile-container">
        <div className="profile-info">
          <h2>Profile Information</h2>
          <div>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Email:</strong> {email}</p>
            <button>Change Username</button>
            <button>Change Password</button>
          </div>
        </div>
        <div className="profile-stats">
          <h2>Statistics</h2>
          <ul>
            {Object.entries(statistics).map(([key, value]) => (
              <li key={key}><strong>{key}:</strong> {value}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

const App = () => {
  const user = {
    username: 'exampleUser',
    email: 'user@example.com',
    statistics: {
      gamesPlayed: 10,
      wins: 5,
      losses: 5,
      draws: 0
    }
  };

  return (
    <div>
      <h1>Welcome to Your Profile Page</h1>
      <Profile
        username={user.username}
        email={user.email}
        statistics={user.statistics}
      />
    </div>
  );
};

export default App;
