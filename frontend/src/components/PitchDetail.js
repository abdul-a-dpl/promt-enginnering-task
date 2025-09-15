import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const PitchDetail = ({ user, onLogout }) => {
  const { id } = useParams();
  const [pitch, setPitch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showAllFeedback, setShowAllFeedback] = useState(false);

  useEffect(() => {
    fetchPitch();
  }, [id]);

  const fetchPitch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/pitches/${id}`);
      setPitch(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch pitch details');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (user.role !== 'reviewer') {
      setError('Only reviewers can vote');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`/pitches/${id}/vote`, { rating });
      setMessage('Rating submitted successfully!');
      fetchPitch(); // Refresh pitch data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (user.role !== 'reviewer') {
      setError('Only reviewers can submit feedback');
      return;
    }

    if (!feedback.trim()) {
      setError('Please enter feedback');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`/pitches/${id}/feedback`, { content: feedback });
      setMessage('Feedback submitted successfully!');
      setFeedback('');
      fetchPitch(); // Refresh pitch data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= rating ? 'filled' : 'empty'} ${interactive ? 'interactive' : ''}`}
          onClick={() => interactive && user.role === 'reviewer' && setRating(i)}
        >
          {i <= rating ? '★' : '☆'}
        </span>
      );
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

  const displayFeedback = showAllFeedback ? pitch?.feedback : pitch?.feedback?.slice(0, 5);

  if (loading) {
    return (
      <div className="pitch-detail">
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
          <div className="loading">Loading pitch details...</div>
        </div>
      </div>
    );
  }

  if (!pitch) {
    return (
      <div className="pitch-detail">
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
          <div className="error">Pitch not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pitch-detail">
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
        {/* Pitch Header */}
        <div className="pitch-header">
          <div className="pitch-title">
            <h1>{pitch.title}</h1>
            <p className="team-name">by {pitch.team.name}</p>
            <div className="category-tag" style={{ backgroundColor: getCategoryColor(pitch.category) }}>
              {pitch.category.toUpperCase()}
            </div>
          </div>
          <div className="pitch-stats">
            <div className="rating-display">
              <div className="stars">{renderStars(Math.floor(pitch.averageRating))}</div>
              <span className="rating-text">{pitch.averageRating.toFixed(1)}</span>
            </div>
            <div className="vote-count">{pitch.totalVotes} votes</div>
          </div>
        </div>

        {/* Video and Deck Links */}
        <div className="media-links-section">
          <div className="media-link-card">
            <div className="media-icon">🎥</div>
            <div className="media-content">
              <h3>Demo Video</h3>
              <p>Watch the 3-minute pitch demo</p>
              <a href={pitch.demoLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Watch Demo
              </a>
            </div>
          </div>
          
          <div className="media-link-card">
            <div className="media-icon">📊</div>
            <div className="media-content">
              <h3>Pitch Deck</h3>
              <p>View the complete presentation</p>
              <a href={pitch.deckUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                View Deck
              </a>
            </div>
          </div>
        </div>

        {/* Rating and Feedback Section */}
        {user.role === 'reviewer' && (
          <div className="review-section">
            <div className="rating-section">
              <h3>Rate this Pitch</h3>
              <div className="rating-widget">
                <div className="stars">{renderStars(rating, true)}</div>
                <span className="rating-text">
                  {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Click to rate'}
                </span>
              </div>
              <button 
                onClick={handleRatingSubmit} 
                disabled={rating === 0 || submitting}
                className="btn btn-primary"
              >
                {submitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>

            <div className="feedback-section">
              <h3>Leave Feedback</h3>
              <div className="feedback-composer">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts about this pitch (max 240 characters)"
                  maxLength="240"
                  rows="4"
                  className="feedback-textarea"
                />
                <div className="feedback-actions">
                  <div className="char-count">{feedback.length}/240</div>
                  <button 
                    onClick={handleFeedbackSubmit} 
                    disabled={!feedback.trim() || submitting}
                    className="btn btn-secondary"
                  >
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback List */}
        <div className="feedback-list-section">
          <div className="section-header">
            <h3>Community Feedback</h3>
            {pitch.feedback && pitch.feedback.length > 5 && (
              <button 
                onClick={() => setShowAllFeedback(!showAllFeedback)}
                className="btn btn-outline btn-small"
              >
                {showAllFeedback ? 'Show Less' : 'View More'}
              </button>
            )}
          </div>
          
          {pitch.feedback && displayFeedback && displayFeedback.length > 0 ? (
            <div className="feedback-items">
              {displayFeedback.map((item, index) => (
                <div key={index} className="feedback-item">
                  <div className="feedback-content">{item.content}</div>
                  <div className="feedback-meta">
                    <span className="reviewer-name">{item.reviewerName}</span>
                    <span className="feedback-date">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-feedback">
              <p>No feedback yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>

        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}
      </div>
    </div>
  );
};

export default PitchDetail;
