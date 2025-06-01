import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('https://special-sniffle-4j77j75qqprf5w7g-8000.app.github.dev/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok && data.key) {
      setMessage('Login successful!');
      // Save token to localStorage for persistence
      localStorage.setItem('octofit_token', data.key);
      if (onLoginSuccess) {
        onLoginSuccess({ username }, data.key);
      }
    } else {
      setMessage(JSON.stringify(data));
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 300, margin: '2rem auto' }}>
      <h2>Login</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="form-control mb-2" />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="form-control mb-2" />
      <button type="submit" className="btn btn-success w-100">Login</button>
      <div className="mt-2 text-danger">{message}</div>
    </form>
  );
}
