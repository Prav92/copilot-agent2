import React, { useState } from 'react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch('https://special-sniffle-4j77j75qqprf5w7g-8000.app.github.dev/api/auth/registration/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password1, password2 }),
    });
    const data = await response.json();
    if (response.ok) {
      setMessage('Registration successful!');
    } else {
      setMessage(JSON.stringify(data));
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: 300, margin: '2rem auto' }}>
      <h2>Register</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="form-control mb-2" />
      <input type="password" placeholder="Password" value={password1} onChange={e => setPassword1(e.target.value)} className="form-control mb-2" />
      <input type="password" placeholder="Confirm Password" value={password2} onChange={e => setPassword2(e.target.value)} className="form-control mb-2" />
      <button type="submit" className="btn btn-primary w-100">Register</button>
      <div className="mt-2 text-danger">{message}</div>
    </form>
  );
}
