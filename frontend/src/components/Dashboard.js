import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-brand">
          <h1>🚀 Startup Pitch Showcase</h1>
        </div>
        <div className="nav-user">
          <span>Welcome, {user.name} ({user.role})</span>
          <button onClick={onLogout} className="btn btn-outline">Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="welcome-section">
          <h2>Welcome to the Startup Pitch Showcase!</h2>
          <p>Discover innovative startups, vote on pitches, and see the leaderboard.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>📊 Leaderboard</h3>
            <p>See the top-ranked startup pitches based on community ratings</p>
            <Link to="/leaderboard" className="btn btn-primary">View Leaderboard</Link>
          </div>

          <div className="dashboard-card">
            <h3>🔍 Browse Pitches</h3>
            <p>Explore all submitted startup pitches with filters and search</p>
            <Link to="/browse" className="btn btn-primary">Browse Pitches</Link>
          </div>

          {user.role === 'founder' && (
            <div className="dashboard-card">
              <h3>👥 Manage Teams</h3>
              <p>Create teams and submit your startup pitch</p>
              <Link to="/founder" className="btn btn-primary">Founder Dashboard</Link>
            </div>
          )}

          {user.role === 'reviewer' && (
            <div className="dashboard-card">
              <h3>⭐ Review Pitches</h3>
              <p>Rate pitches and provide feedback to help startups improve</p>
              <Link to="/reviewer" className="btn btn-primary">Reviewer Dashboard</Link>
            </div>
          )}
        </div>

        <div className="info-section">
          <h3>How it works:</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>For Founders:</h4>
              <ul>
                <li>Create and manage your team</li>
                <li>Submit one pitch per team</li>
                <li>Include title, demo link, and deck URL</li>
                <li>Track your ranking on the leaderboard</li>
              </ul>
            </div>
            <div className="info-item">
              <h4>For Reviewers:</h4>
              <ul>
                <li>Browse and filter pitches by category</li>
                <li>Rate pitches 1-5 stars</li>
                <li>Leave optional feedback (max 240 chars)</li>
                <li>Help determine the leaderboard rankings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
