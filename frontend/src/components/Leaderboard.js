import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Leaderboard = ({ user, onLogout }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLeaderboard();
  }, [currentPage]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/leaderboard?page=${currentPage}&limit=20`);
      setLeaderboard(response.data.leaderboard);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (err) {
      setError('Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    return stars;
  };

  const getCategoryColor = (category) => {
    const colors = {
      fintech: '#4CAF50',
      health: '#2196F3',
      ai: '#FF9800',
      other: '#9C27B0'
    };
    return colors[category] || '#666';
  };

  if (loading) {
    return (
      <div className="leaderboard">
        <nav className="navbar">
          <div className="nav-brand">
            <Link to="/">🚀 Startup Pitch Showcase</Link>
          </div>
          <div className="nav-user">
            <span>{user.name} ({user.role})</span>
            <button onClick={onLogout} className="btn btn-outline">Logout</button>
          </div>
        </nav>
        <div className="container">
          <div className="loading">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">🚀 Startup Pitch Showcase</Link>
        </div>
        <div className="nav-user">
          <span>{user.name} ({user.role})</span>
          <button onClick={onLogout} className="btn btn-outline">Logout</button>
        </div>
      </nav>

      <div className="container">
        <div className="page-header">
          <h1>🏆 Leaderboard</h1>
          <p>Top-ranked startup pitches based on community ratings</p>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="leaderboard-table">
          <div className="table-header">
            <div className="rank-col">Rank</div>
            <div className="team-col">Team Name</div>
            <div className="pitch-col">Pitch Title</div>
            <div className="category-col">Category</div>
            <div className="rating-col">Avg Rating</div>
            <div className="votes-col">Total Votes</div>
            <div className="actions-col">Actions</div>
          </div>
          
          <div className="table-body">
            {leaderboard.map((item, index) => (
              <div key={item.pitch.id} className="table-row">
                <div className="rank-col">
                  <span className="rank-number">#{((currentPage - 1) * 20) + index + 1}</span>
                </div>
                <div className="team-col">
                  <span className="team-name">{item.team.name}</span>
                </div>
                <div className="pitch-col">
                  <span className="pitch-title">{item.pitch.title}</span>
                </div>
                <div className="category-col">
                  <div className="category-tag" style={{ backgroundColor: getCategoryColor(item.pitch.category) }}>
                    {item.pitch.category.toUpperCase()}
                  </div>
                </div>
                <div className="rating-col">
                  <div className="rating-display">
                    <div className="stars">{renderStars(item.averageRating)}</div>
                    <span className="rating-text">{item.averageRating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="votes-col">
                  <span className="vote-count">{item.totalVotes}</span>
                </div>
                <div className="actions-col">
                  <Link to={`/pitch/${item.pitch.id}`} className="btn btn-primary btn-small">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(currentPage - 1)} 
              disabled={currentPage === 1}
              className="btn btn-outline"
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="btn btn-outline"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
