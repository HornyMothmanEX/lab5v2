import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import PlaceList from './components/PlaceList';
import SharePlace from './components/SharePlace';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import { api } from './utils/Api';
import './App.css';
import './index.css';

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);

  // Read user data from localStorage and check session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); // Set user from localStorage if available
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove user data from localStorage
  };

  const handleLogin = async (credentials) => {
    try {
      const userData = await api.login(credentials);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData)); // Store user data in localStorage
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleRegister = async (userData) => {
    try {
      const newUser = await api.register(userData);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser)); // Store user data in localStorage
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <div className="App">
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/places">Places</Link></li>
              {user ? (
                <>
                  <li><Link to="/profile">Profile</Link></li>
                  <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Register</Link></li>
                </>
              )}
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/places" element={<PlaceList />} />
            <Route path="/share" element={<SharePlace />} />
            <Route path="/login" element={user ? <Navigate to="/profile" /> : <Login onLogin={handleLogin} />} />
            <Route path="/register" element={user ? <Navigate to="/profile" /> : <Register onRegister={handleRegister} />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
