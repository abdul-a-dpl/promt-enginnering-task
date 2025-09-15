const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/startup-pitch';
mongoose.connect(MONGODB_URI);

// Import models
const User = require('../models/User');
const Team = require('../models/Team');
const Pitch = require('../models/Pitch');
const Vote = require('../models/Vote');
const Feedback = require('../models/Feedback');

// Mock data generators
const categories = ['fintech', 'health', 'ai', 'other'];
const teamNames = [
  'TechVision', 'DataFlow', 'CloudSync', 'NextGen', 'InnovateLab',
  'FutureTech', 'SmartSolutions', 'DigitalWave', 'CodeCraft', 'TechHub',
  'StartupX', 'InnovationCo', 'TechForge', 'DigitalEdge', 'FutureLab',
  'TechNova', 'InnovateNow', 'DigitalCraft', 'TechPulse', 'NextWave',
  'SmartTech', 'DataDriven', 'CloudFirst', 'TechForward', 'InnovateHub',
  'DigitalFirst', 'TechCore', 'FutureForward', 'InnovateTech', 'SmartCore',
  'TechEdge', 'DataCore', 'CloudTech', 'NextTech', 'InnovateCore',
  'DigitalCore', 'TechFirst', 'FutureTech', 'SmartForward', 'InnovateEdge',
  'TechCraft', 'DataEdge', 'CloudCore', 'NextCore', 'InnovateFirst',
  'DigitalEdge', 'TechCore', 'FutureCore', 'SmartCore', 'InnovateCore',
  'TechCore', 'DataCore', 'CloudCore', 'NextCore', 'InnovateCore',
  'DigitalCore', 'TechCore', 'FutureCore', 'SmartCore', 'InnovateCore',
  'TechCore', 'DataCore', 'CloudCore', 'NextCore', 'InnovateCore',
  'DigitalCore', 'TechCore', 'FutureCore', 'SmartCore', 'InnovateCore'
];

const pitchTitles = [
  'Revolutionary AI-Powered Healthcare Platform',
  'Next-Gen Fintech Solution for SMEs',
  'Smart City IoT Management System',
  'Blockchain-Based Supply Chain Tracker',
  'AI-Driven Personal Finance Assistant',
  'Telemedicine Platform for Rural Areas',
  'Machine Learning Fraud Detection',
  'Sustainable Energy Management System',
  'AR/VR Training Platform for Healthcare',
  'Cryptocurrency Trading Bot',
  'Smart Home Automation System',
  'AI-Powered Customer Service Bot',
  'Digital Identity Verification Platform',
  'Predictive Analytics for Agriculture',
  'Blockchain Voting System',
  'AI-Powered Content Creation Tool',
  'Smart Transportation Management',
  'Digital Health Monitoring Platform',
  'AI-Driven Investment Advisor',
  'Sustainable Waste Management Solution'
];

const feedbackTemplates = [
  'Great concept with strong market potential!',
  'Interesting approach to solving this problem.',
  'The demo was impressive and well-executed.',
  'Could benefit from more user testing.',
  'Strong technical implementation.',
  'Market validation needed.',
  'Excellent presentation and clear value proposition.',
  'Consider expanding to other markets.',
  'Great use of technology to solve real problems.',
  'Need more focus on user experience.',
  'Solid business model and execution.',
  'Consider partnerships for faster growth.',
  'Excellent technical innovation.',
  'Strong team with relevant experience.',
  'Clear path to monetization.',
  'Great potential for scaling.',
  'Consider international expansion.',
  'Excellent problem-solution fit.',
  'Strong competitive advantage.',
  'Great execution of the concept.'
];

async function seedData() {
  try {
    console.log('Starting seed data generation...');

    // Clear existing data
    await User.deleteMany({});
    await Team.deleteMany({});
    await Pitch.deleteMany({});
    await Vote.deleteMany({});
    await Feedback.deleteMany({});

    // Create users (80 founders + 20 reviewers)
    const founders = [];
    const reviewers = [];

    // Create founders
    for (let i = 0; i < 80; i++) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const founder = new User({
        email: `founder${i + 1}@example.com`,
        password: hashedPassword,
        role: 'founder',
        name: `Founder ${i + 1}`
      });
      await founder.save();
      founders.push(founder);
    }

    // Create reviewers
    for (let i = 0; i < 20; i++) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const reviewer = new User({
        email: `reviewer${i + 1}@example.com`,
        password: hashedPassword,
        role: 'reviewer',
        name: `Reviewer ${i + 1}`
      });
      await reviewer.save();
      reviewers.push(reviewer);
    }

    console.log('Created users:', founders.length + reviewers.length);

    // Create teams (80 teams)
    const teams = [];
    for (let i = 0; i < 80; i++) {
      const team = new Team({
        name: teamNames[i],
        founder: founders[i]._id,
        members: [
          { name: `Member 1 of ${teamNames[i]}`, role: 'CTO', email: `member1@${teamNames[i].toLowerCase()}.com` },
          { name: `Member 2 of ${teamNames[i]}`, role: 'Designer', email: `member2@${teamNames[i].toLowerCase()}.com` }
        ]
      });
      await team.save();
      teams.push(team);
    }

    console.log('Created teams:', teams.length);

    // Create pitches (120 pitches, some teams have no pitch)
    const pitches = [];
    for (let i = 0; i < 120; i++) {
      const teamIndex = i % teams.length;
      const pitch = new Pitch({
        team: teams[teamIndex]._id,
        title: pitchTitles[i % pitchTitles.length] + ` ${i + 1}`,
        demoLink: `https://demo.example.com/pitch${i + 1}`,
        deckUrl: `https://deck.example.com/pitch${i + 1}`,
        category: categories[i % categories.length],
        status: Math.random() > 0.1 ? 'submitted' : 'draft' // 90% submitted, 10% draft
      });
      await pitch.save();
      pitches.push(pitch);
    }

    console.log('Created pitches:', pitches.length);

    // Create votes and feedback for submitted pitches
    const submittedPitches = pitches.filter(p => p.status === 'submitted');
    let voteCount = 0;
    let feedbackCount = 0;

    for (const pitch of submittedPitches) {
      // Each pitch gets 3-8 random votes
      const numVotes = Math.floor(Math.random() * 6) + 3;
      const selectedReviewers = reviewers.sort(() => 0.5 - Math.random()).slice(0, numVotes);

      for (const reviewer of selectedReviewers) {
        // Create vote
        const vote = new Vote({
          pitch: pitch._id,
          reviewer: reviewer._id,
          rating: Math.floor(Math.random() * 5) + 1
        });
        await vote.save();
        voteCount++;

        // 70% chance of feedback
        if (Math.random() < 0.7) {
          const feedback = new Feedback({
            pitch: pitch._id,
            reviewer: reviewer._id,
            content: feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)]
          });
          await feedback.save();
          feedbackCount++;
        }
      }
    }

    console.log('Created votes:', voteCount);
    console.log('Created feedback:', feedbackCount);
    console.log('Seed data generation completed successfully!');

    // Print summary
    console.log('\n=== SEED DATA SUMMARY ===');
    console.log(`Founders: ${founders.length}`);
    console.log(`Reviewers: ${reviewers.length}`);
    console.log(`Teams: ${teams.length}`);
    console.log(`Pitches: ${pitches.length} (${submittedPitches.length} submitted, ${pitches.length - submittedPitches.length} draft)`);
    console.log(`Votes: ${voteCount}`);
    console.log(`Feedback: ${feedbackCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
