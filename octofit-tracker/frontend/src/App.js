
import './App.css';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import React, { useState, useEffect } from 'react';


function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('octofit_token'));

  useEffect(() => {
    // Fetch user info if token exists and user is not set
    if (token && !user) {
      fetch('https://special-sniffle-4j77j75qqprf5w7g-8000.app.github.dev/api/userprofiles/me/', {
        headers: { 'Authorization': `Token ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(profile => {
          if (profile && profile.user) {
            setUser({ username: profile.user.username });
          }
        });
    }
  }, [token, user]);

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    setToken(token);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('octofit_token');
  };

  return (
    <div className="App">
      <h1>OctoFit Tracker</h1>
      {user && (
        <button className="btn btn-danger float-end" style={{ margin: 10 }} onClick={handleLogout}>
          Logout
        </button>
      )}
      {!user ? (
        <>
          <Register />
          <Login onLoginSuccess={handleLoginSuccess} />
        </>
      ) : (
        <Dashboard user={user} token={token} />
      )}
    </div>
  );
}

export default App;
