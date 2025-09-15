import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FounderConsole = ({ user, onLogout }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showCreatePitch, setShowCreatePitch] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [message, setMessage] = useState('');

  const [teamForm, setTeamForm] = useState({
    name: '',
    members: [{ name: '', role: '', email: '' }]
  });

  const [pitchForm, setPitchForm] = useState({
    title: '',
    demoLink: '',
    deckUrl: '',
    category: 'fintech'
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/teams');
      setTeams(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/teams', teamForm);
      setMessage('Team created successfully!');
      setShowCreateTeam(false);
      setTeamForm({ name: '', members: [{ name: '', role: '', email: '' }] });
      fetchTeams();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create team');
    }
  };

  const handleCreatePitch = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/pitches', {
        teamId: selectedTeam._id,
        ...pitchForm
      });
      setMessage('Pitch submitted successfully!');
      setShowCreatePitch(false);
      setPitchForm({ title: '', demoLink: '', deckUrl: '', category: 'fintech' });
      fetchTeams();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create pitch');
    }
  };

  const addTeamMember = () => {
    setTeamForm({
      ...teamForm,
      members: [...teamForm.members, { name: '', role: '', email: '' }]
    });
  };

  const updateTeamMember = (index, field, value) => {
    const updatedMembers = [...teamForm.members];
    updatedMembers[index][field] = value;
    setTeamForm({ ...teamForm, members: updatedMembers });
  };

  const removeTeamMember = (index) => {
    const updatedMembers = teamForm.members.filter((_, i) => i !== index);
    setTeamForm({ ...teamForm, members: updatedMembers });
  };

  const checkTeamHasPitch = async (teamId) => {
    try {
      const response = await axios.get(`/pitches?teamId=${teamId}`);
      return response.data.pitches.length > 0;
    } catch (err) {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="founder-console">
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
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="founder-console">
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
          <h1>👥 Founder Console</h1>
          <p>Manage your teams and submit pitches</p>
        </div>

        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}

        <div className="console-actions">
          <button 
            onClick={() => setShowCreateTeam(true)} 
            className="btn btn-primary"
          >
            Create New Team
          </button>
        </div>

        <div className="teams-section">
          <h2>Your Teams</h2>
          {teams.length === 0 ? (
            <div className="empty-state">
              <p>You haven't created any teams yet.</p>
              <button 
                onClick={() => setShowCreateTeam(true)} 
                className="btn btn-primary"
              >
                Create Your First Team
              </button>
            </div>
          ) : (
            <div className="teams-grid">
              {teams.map(team => (
                <div key={team._id} className="team-card">
                  <div className="team-header">
                    <h3>{team.name}</h3>
                    <div className="team-status">
                      <span className="status-indicator">Active</span>
                    </div>
                  </div>
                  
                  <div className="team-members">
                    <h4>Team Members:</h4>
                    {team.members.map((member, index) => (
                      <div key={index} className="member">
                        <div className="member-info">
                          <strong>{member.name}</strong>
                          <span className="member-role">{member.role}</span>
                        </div>
                        <div className="member-email">{member.email}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="team-actions">
                    <button 
                      onClick={async () => {
                        const hasPitch = await checkTeamHasPitch(team._id);
                        if (hasPitch) {
                          setError('This team already has a pitch submitted');
                          return;
                        }
                        setSelectedTeam(team);
                        setShowCreatePitch(true);
                      }}
                      className="btn btn-primary"
                    >
                      Submit Pitch
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Team Modal */}
        {showCreateTeam && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Create New Team</h2>
              <form onSubmit={handleCreateTeam}>
                <div className="form-group">
                  <label htmlFor="teamName">Team Name:</label>
                  <input
                    type="text"
                    id="teamName"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                    required
                    placeholder="Enter team name"
                  />
                </div>

                <div className="form-group">
                  <label>Team Members:</label>
                  {teamForm.members.map((member, index) => (
                    <div key={index} className="member-form">
                      <input
                        type="text"
                        placeholder="Member Name"
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Role (e.g., CTO, Designer)"
                        value={member.role}
                        onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={member.email}
                        onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                        required
                      />
                      {teamForm.members.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeTeamMember(index)}
                          className="btn btn-danger btn-small"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addTeamMember} className="btn btn-secondary">
                    Add Member
                  </button>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">Create Team</button>
                  <button 
                    type="button" 
                    onClick={() => setShowCreateTeam(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Pitch Modal */}
        {showCreatePitch && selectedTeam && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Submit Pitch for {selectedTeam.name}</h2>
              <form onSubmit={handleCreatePitch}>
                <div className="form-group">
                  <label htmlFor="pitchTitle">Pitch Title:</label>
                  <input
                    type="text"
                    id="pitchTitle"
                    value={pitchForm.title}
                    onChange={(e) => setPitchForm({ ...pitchForm, title: e.target.value })}
                    placeholder="One-liner title for your pitch"
                    maxLength="100"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="demoLink">Demo Link (3 mins):</label>
                  <input
                    type="url"
                    id="demoLink"
                    value={pitchForm.demoLink}
                    onChange={(e) => setPitchForm({ ...pitchForm, demoLink: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="deckUrl">Deck URL:</label>
                  <input
                    type="url"
                    id="deckUrl"
                    value={pitchForm.deckUrl}
                    onChange={(e) => setPitchForm({ ...pitchForm, deckUrl: e.target.value })}
                    placeholder="https://docs.google.com/presentation/..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category:</label>
                  <select
                    id="category"
                    value={pitchForm.category}
                    onChange={(e) => setPitchForm({ ...pitchForm, category: e.target.value })}
                    required
                  >
                    <option value="fintech">Fintech</option>
                    <option value="health">Health</option>
                    <option value="ai">AI</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">Submit Pitch</button>
                  <button 
                    type="button" 
                    onClick={() => setShowCreatePitch(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FounderConsole;
