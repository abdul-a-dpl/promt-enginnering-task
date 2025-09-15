import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ReviewerDashboard = ({ user, onLogout }) => {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    page: 1
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPitches();
  }, [filters]);

  const fetchPitches = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page);
      params.append('limit', '12');

      const response = await axios.get(`/pitches?${params}`);
      setPitches(response.data.pitches);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (err) {
      setError('Failed to fetch pitches');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
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
      <div className="reviewer-dashboard">
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
          <div className="loading">Loading pitches...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="reviewer-dashboard">
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
          <h1>⭐ Reviewer Dashboard</h1>
          <p>Browse and rate startup pitches</p>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="filters-section">
          <div className="filter-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="fintech">Fintech</option>
              <option value="health">Health</option>
              <option value="ai">AI</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="search">Search:</label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by title..."
            />
          </div>
        </div>

        <div className="pitches-grid">
          {pitches.length === 0 ? (
            <div className="empty-state">
              <p>No pitches found matching your criteria.</p>
            </div>
          ) : (
            pitches.map(pitch => (
              <div key={pitch._id} className="pitch-card">
                <div className="pitch-header">
                  <h3>{pitch.title}</h3>
                  <p className="team-name">by {pitch.team.name}</p>
                  <div className="category-tag" style={{ backgroundColor: getCategoryColor(pitch.category) }}>
                    {pitch.category.toUpperCase()}
                  </div>
                </div>

                <div className="pitch-stats">
                  <div className="rating">
                    <div className="stars">{renderStars(pitch.averageRating)}</div>
                    <span className="rating-text">{pitch.averageRating.toFixed(1)}</span>
                  </div>
                  <div className="votes">{pitch.totalVotes} votes</div>
                </div>

                <div className="pitch-links">
                  <a 
                    href={pitch.demoLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-small btn-outline"
                  >
                    🎥 Demo
                  </a>
                  <a 
                    href={pitch.deckUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-small btn-outline"
                  >
                    📊 Deck
                  </a>
                </div>

                <div className="pitch-actions">
                  <Link to={`/pitch/${pitch._id}`} className="btn btn-primary">
                    Review Pitch
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => handlePageChange(filters.page - 1)} 
              disabled={filters.page === 1}
              className="btn btn-outline"
            >
              Previous
            </button>
            <span className="page-info">
              Page {filters.page} of {totalPages}
            </span>
            <button 
              onClick={() => handlePageChange(filters.page + 1)} 
              disabled={filters.page === totalPages}
              className="btn btn-outline"
            >
              Next
            </button>
          </div>
        )}

        <div className="reviewer-info">
          <h3>How to Review:</h3>
          <ul>
            <li>Watch the demo video and review the pitch deck</li>
            <li>Rate the pitch from 1-5 stars based on innovation, market potential, and execution</li>
            <li>Leave constructive feedback to help founders improve</li>
            <li>Your ratings contribute to the leaderboard rankings</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReviewerDashboard;
