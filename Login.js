import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import { useNavigate, Navigate } from 'react-router-dom';
import { api } from '../utils/Api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await api.login({ email, password });
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));  // Store user in localStorage for persistence
      navigate('/profile');
    } catch (error) {
      alert('Invalid credentials!');
      console.error('Login failed:', error);
    }
  };

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
