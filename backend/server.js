const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const Filter = require('bad-words');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting for voting
const voteRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 votes per minute per IP
  message: { error: 'Too many votes, please try again later' }
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/startup-pitch';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Models
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['founder', 'reviewer'],
    required: true
  },
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  founder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    name: String,
    role: String,
    email: String
  }]
}, {
  timestamps: true
});

const pitchSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  demoLink: {
    type: String,
    required: true
  },
  deckUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['fintech', 'health', 'ai', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted'],
    default: 'draft'
  }
}, {
  timestamps: true
});

const voteSchema = new mongoose.Schema({
  pitch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pitch',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

const feedbackSchema = new mongoose.Schema({
  pitch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pitch',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 240
  }
}, {
  timestamps: true
});

// Add indexes for performance
voteSchema.index({ pitch: 1, reviewer: 1 }, { unique: true });
feedbackSchema.index({ pitch: 1, createdAt: -1 });

const User = mongoose.model('User', userSchema);
const Team = mongoose.model('Team', teamSchema);
const Pitch = mongoose.model('Pitch', pitchSchema);
const Vote = mongoose.model('Vote', voteSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Profanity filter
const filter = new Filter();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Startup Pitch Showcase API is running!' });
});

// Authentication routes
app.post('/auth/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['founder', 'reviewer']),
  body('name').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      role,
      name
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Team routes (founder only)
app.post('/teams', authenticateToken, requireRole(['founder']), [
  body('name').notEmpty().trim(),
  body('members').isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, members } = req.body;

    const team = new Team({
      name,
      founder: req.user.userId,
      members: members || []
    });

    await team.save();
    await team.populate('founder', 'name email');

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/teams', authenticateToken, requireRole(['founder']), async (req, res) => {
  try {
    const teams = await Team.find({ founder: req.user.userId }).populate('founder', 'name email');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pitch routes
app.post('/pitches', authenticateToken, requireRole(['founder']), [
  body('teamId').isMongoId(),
  body('title').isLength({ min: 1, max: 100 }),
  body('demoLink').isURL(),
  body('deckUrl').isURL(),
  body('category').isIn(['fintech', 'health', 'ai', 'other'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { teamId, title, demoLink, deckUrl, category } = req.body;

    // Verify team belongs to founder
    const team = await Team.findOne({ _id: teamId, founder: req.user.userId });
    if (!team) {
      return res.status(404).json({ error: 'Team not found or access denied' });
    }

    // Check if team already has a pitch
    const existingPitch = await Pitch.findOne({ team: teamId });
    if (existingPitch) {
      return res.status(400).json({ error: 'Team already has a pitch' });
    }

    const pitch = new Pitch({
      team: teamId,
      title,
      demoLink,
      deckUrl,
      category,
      status: 'submitted'
    });

    await pitch.save();
    await pitch.populate('team', 'name');

    res.status(201).json(pitch);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/pitches', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = { status: 'submitted' };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const pitches = await Pitch.find(query)
      .populate('team', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get vote counts and average ratings
    const pitchesWithStats = await Promise.all(
      pitches.map(async (pitch) => {
        const votes = await Vote.find({ pitch: pitch._id });
        const avgRating = votes.length > 0 
          ? votes.reduce((sum, vote) => sum + vote.rating, 0) / votes.length 
          : 0;
        
        return {
          ...pitch.toObject(),
          totalVotes: votes.length,
          averageRating: Math.round(avgRating * 10) / 10
        };
      })
    );

    const total = await Pitch.countDocuments(query);

    res.json({
      pitches: pitchesWithStats,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/pitches/:id', async (req, res) => {
  try {
    const pitch = await Pitch.findById(req.params.id)
      .populate('team', 'name members');

    if (!pitch) {
      return res.status(404).json({ error: 'Pitch not found' });
    }

    // Get votes and feedback
    const votes = await Vote.find({ pitch: pitch._id }).populate('reviewer', 'name');
    const feedback = await Feedback.find({ pitch: pitch._id })
      .populate('reviewer', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const avgRating = votes.length > 0 
      ? votes.reduce((sum, vote) => sum + vote.rating, 0) / votes.length 
      : 0;

    res.json({
      ...pitch.toObject(),
      totalVotes: votes.length,
      averageRating: Math.round(avgRating * 10) / 10,
      feedback: feedback.map(f => ({
        content: f.content,
        reviewerName: f.reviewer.name,
        createdAt: f.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Voting routes (reviewer only)
app.post('/pitches/:id/vote', authenticateToken, requireRole(['reviewer']), voteRateLimit, [
  body('rating').isInt({ min: 1, max: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating } = req.body;
    const pitchId = req.params.id;

    // Check if pitch exists
    const pitch = await Pitch.findById(pitchId);
    if (!pitch) {
      return res.status(404).json({ error: 'Pitch not found' });
    }

    // Upsert vote (update if exists, create if not)
    const vote = await Vote.findOneAndUpdate(
      { pitch: pitchId, reviewer: req.user.userId },
      { rating },
      { upsert: true, new: true }
    );

    res.json({ message: 'Vote recorded successfully', vote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/pitches/:id/feedback', authenticateToken, requireRole(['reviewer']), [
  body('content').isLength({ min: 1, max: 240 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;
    const pitchId = req.params.id;

    // Check for profanity
    if (filter.isProfane(content)) {
      return res.status(400).json({ error: 'Feedback contains inappropriate content' });
    }

    // Check if pitch exists
    const pitch = await Pitch.findById(pitchId);
    if (!pitch) {
      return res.status(404).json({ error: 'Pitch not found' });
    }

    const feedback = new Feedback({
      pitch: pitchId,
      reviewer: req.user.userId,
      content
    });

    await feedback.save();
    await feedback.populate('reviewer', 'name');

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: {
        content: feedback.content,
        reviewerName: feedback.reviewer.name,
        createdAt: feedback.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leaderboard route
app.get('/leaderboard', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Get all submitted pitches with their teams
    const pitches = await Pitch.find({ status: 'submitted' })
      .populate('team', 'name')
      .sort({ createdAt: -1 });

    // Calculate weighted scores
    const leaderboard = await Promise.all(
      pitches.map(async (pitch) => {
        const votes = await Vote.find({ pitch: pitch._id });
        const avgRating = votes.length > 0 
          ? votes.reduce((sum, vote) => sum + vote.rating, 0) / votes.length 
          : 0;
        
        const weightedScore = avgRating * Math.log10(votes.length + 1);
        
        // Get most recent vote timestamp
        const mostRecentVote = votes.length > 0 
          ? Math.max(...votes.map(v => new Date(v.createdAt).getTime()))
          : 0;

        return {
          team: pitch.team,
          pitch: {
            id: pitch._id,
            title: pitch.title,
            category: pitch.category,
            createdAt: pitch.createdAt
          },
          averageRating: Math.round(avgRating * 10) / 10,
          totalVotes: votes.length,
          weightedScore: Math.round(weightedScore * 100) / 100,
          mostRecentVoteTimestamp: mostRecentVote
        };
      })
    );

    // Sort by weighted score, then by most recent vote timestamp
    leaderboard.sort((a, b) => {
      if (b.weightedScore !== a.weightedScore) {
        return b.weightedScore - a.weightedScore;
      }
      return b.mostRecentVoteTimestamp - a.mostRecentVoteTimestamp;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedLeaderboard = leaderboard.slice(startIndex, endIndex);

    res.json({
      leaderboard: paginatedLeaderboard,
      totalPages: Math.ceil(leaderboard.length / limit),
      currentPage: parseInt(page),
      total: leaderboard.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation error', details: error.message });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  if (error.code === 11000) {
    return res.status(400).json({ error: 'Duplicate entry' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Startup Pitch Showcase API is running on port ${PORT}`);
});