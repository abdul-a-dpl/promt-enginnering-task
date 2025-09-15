import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Components
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import PitchBrowser from './components/PitchBrowser';
import PitchDetail from './components/PitchDetail';
import FounderConsole from './components/FounderDashboard';
import ReviewerDashboard from './components/ReviewerDashboard';

// API Configuration
const API_BASE_URL = 'http://localhost:5000';

// Set up axios defaults
axios.defaults.baseURL = API_BASE_URL;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // You could verify the token here if needed
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Authentication Routes */}
          <Route 
            path="/login" 
            element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/signup" 
            element={!user ? <Signup onLogin={handleLogin} /> : <Navigate to="/" />} 
          />
          
          {/* Main Dashboard */}
          <Route 
            path="/" 
            element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          
          {/* Leaderboard (Home) */}
          <Route 
            path="/leaderboard" 
            element={user ? <Leaderboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          
          {/* Pitch Browser */}
          <Route 
            path="/browse" 
            element={user ? <PitchBrowser user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          
          {/* Pitch Detail */}
          <Route 
            path="/pitch/:id" 
            element={user ? <PitchDetail user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          
          {/* Founder Console */}
          <Route 
            path="/founder" 
            element={user && user.role === 'founder' ? <FounderConsole user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
          />
          
          {/* Reviewer Dashboard */}
          <Route 
            path="/reviewer" 
            element={user && user.role === 'reviewer' ? <ReviewerDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;