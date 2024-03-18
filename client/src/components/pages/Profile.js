import React from 'react';
import Header from "../Header";

const UserInfo = ({ username, email, statistics }) => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "1", marginRight: '20px' }}>
        <h2>Profile Information</h2>
        <div>
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Email:</strong> {email}</p>
          <button>Change Username</button>
          <button>Change Password</button>
        </div>
      </div>
      <div>
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

const Profile = () => {
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
    <Header>
      <div>
        <div>
          <h1>Profile Page</h1>
          <UserInfo
            username={user.username}
            email={user.email}
            statistics={user.statistics}
          />
        </div>
      </div>
    </Header>
  );
};

export default Profile;