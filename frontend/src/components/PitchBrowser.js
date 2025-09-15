import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PitchBrowser = ({ user, onLogout }) => {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });

  const categories = [
    { id: '', name: 'All Categories', color: '#666' },
    { id: 'fintech', name: 'Fintech', color: '#4CAF50' },
    { id: 'health', name: 'Health', color: '#2196F3' },
    { id: 'ai', name: 'AI', color: '#FF9800' },
    { id: 'other', name: 'Other', color: '#9C27B0' }
  ];

  const fetchPitches = useCallback(async (page = 1, reset = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      params.append('page', page);
      params.append('limit', '12');

      const response = await axios.get(`/pitches?${params}`);
      
      if (reset) {
        setPitches(response.data.pitches);
      } else {
        setPitches(prev => [...prev, ...response.data.pitches]);
      }
      
      setHasMore(response.data.pitches.length === 12);
      setError('');
    } catch (err) {
      setError('Failed to fetch pitches');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters]);

  useEffect(() => {
    setCurrentPage(1);
    fetchPitches(1, true);
  }, [filters]);

  const handleCategoryFilter = (categoryId) => {
    setFilters(prev => ({ ...prev, category: categoryId }));
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchPitches(nextPage, false);
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
      <div className="pitch-browser">
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
    <div className="pitch-browser">
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
          <h1>🔍 Pitch Browser</h1>
          <p>Discover and explore startup pitches</p>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Search and Filter Section */}
        <div className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search pitches by title..."
              value={filters.search}
              onChange={handleSearchChange}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="category-chips">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={`category-chip ${filters.category === category.id ? 'active' : ''}`}
                style={{ 
                  backgroundColor: filters.category === category.id ? category.color : '#f5f5f5',
                  color: filters.category === category.id ? 'white' : '#666'
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Pitches Grid */}
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
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {hasMore && !loadingMore && (
          <div className="load-more-section">
            <button onClick={handleLoadMore} className="btn btn-primary">
              Load More Pitches
            </button>
          </div>
        )}

        {loadingMore && (
          <div className="loading-more">
            <div className="loading">Loading more pitches...</div>
          </div>
        )}

        {!hasMore && pitches.length > 0 && (
          <div className="end-message">
            <p>You've reached the end of the list!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PitchBrowser;
