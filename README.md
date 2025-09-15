# 🚀 Startup Pitch Showcase

A comprehensive full-stack application for showcasing and rating startup pitches with role-based access control.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-green.svg)](https://mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4+-black.svg)](https://expressjs.com/)

## 📋 Project Overview

**Project Name:** Startup Pitch Showcase  
**Purpose:** A platform where founders can submit startup pitches and reviewers can rate and provide feedback.

### 🎯 Key Features

- **Role-based Authentication:** Founders and Reviewers with different permissions
- **Team Management:** Founders can create and manage teams
- **Pitch Submission:** One pitch per team with title, demo link, and deck URL
- **Rating System:** 1-5 star ratings with optional feedback (max 240 chars)
- **Leaderboard:** Weighted scoring algorithm with real-time rankings
- **Category Filtering:** Fintech, Health, AI, and Other categories
- **Search Functionality:** Search pitches by title
- **Rate Limiting:** Prevents spam voting (max 10 votes/minute)
- **Profanity Filter:** Basic content moderation for feedback

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- **Authentication:** JWT-based with role-based access control
- **Database:** MongoDB with Mongoose ODM
- **API:** RESTful endpoints with comprehensive validation
- **Security:** Rate limiting, input validation, profanity filtering
- **Scoring:** Weighted algorithm: `avg_rating * log10(total_votes + 1)`

### Frontend (React.js)
- **Routing:** React Router for navigation
- **State Management:** React Hooks (useState, useEffect)
- **UI Components:** Modern, responsive design
- **API Integration:** Axios for HTTP requests
- **Authentication:** JWT token management

## 📁 Project Structure

```
startup-pitch-showcase/
├── backend/                    # Node.js Express MongoDB API
│   ├── models/                # Database models
│   │   ├── User.js
│   │   ├── Team.js
│   │   ├── Pitch.js
│   │   ├── Vote.js
│   │   └── Feedback.js
│   ├── scripts/
│   │   └── seedData.js        # Seed data generator
│   ├── package.json
│   ├── server.js              # Main server file
│   └── README.md
├── frontend/                  # React Frontend Application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Leaderboard.js
│   │   │   ├── PitchBrowser.js
│   │   │   ├── PitchDetail.js
│   │   │   ├── FounderDashboard.js
│   │   │   └── ReviewerDashboard.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── README.md
├── .gitignore                 # Git ignore file
└── README.md                  # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd startup-pitch-showcase
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### Setup

1. **Configure Backend Environment**
```bash
cd backend
# Create .env file with MongoDB connection
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/startup-pitch
NODE_ENV=development
JWT_SECRET=your-secret-key" > .env
```

2. **Generate Seed Data (Optional)**
```bash
cd backend
npm run seed
```

### Running the Application

1. **Start the Backend Server**
```bash
cd backend
npm run dev
```
The backend will be running on `http://localhost:5000`

2. **Start the Frontend Server** (in a new terminal)
```bash
cd frontend
npm start
```
The frontend will be running on `http://localhost:3000`

3. **Access the Application**
Open your browser and navigate to `http://localhost:3000`

## 🔐 Demo Credentials

### Founders
- **Email:** founder1@example.com
- **Password:** password123

### Reviewers
- **Email:** reviewer1@example.com
- **Password:** password123

## 📊 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Teams (Founder Only)
- `POST /teams` - Create team
- `GET /teams` - Get founder's teams

### Pitches
- `POST /pitches` - Submit pitch (Founder only)
- `GET /pitches` - Browse pitches (with filters)
- `GET /pitches/:id` - Get pitch details

### Voting & Feedback (Reviewer Only)
- `POST /pitches/:id/vote` - Rate pitch (1-5 stars)
- `POST /pitches/:id/feedback` - Submit feedback

### Leaderboard
- `GET /leaderboard` - Get ranked pitches

## 🎯 User Roles & Permissions

### 👥 Founders
- Create and manage teams
- Submit one pitch per team
- Include: title, demo link, deck URL, category
- View leaderboard rankings

### ⭐ Reviewers
- Browse and filter pitches
- Rate pitches 1-5 stars
- Submit optional feedback (max 240 chars)
- Search pitches by title
- Contribute to leaderboard rankings

## 🏆 Scoring Algorithm

The leaderboard uses a weighted scoring system:

```
weighted_score = (avg_rating * log10(total_votes + 1))
```

**Tie-breaking:** Most recent rating timestamp (newer first)

## 🛡️ Security Features

### Rate Limiting
- **Voting:** Max 10 votes per minute per user
- **API:** General rate limiting on sensitive endpoints

### Input Validation
- **Email:** Valid email format required
- **Password:** Minimum 6 characters
- **Feedback:** Max 240 characters
- **Pitch Title:** Max 100 characters

### Content Moderation
- **Profanity Filter:** Basic word list-based filtering
- **Role-based Access:** Endpoints protected by user roles

## 📈 Seed Data

The application includes comprehensive seed data:
- **80+ Teams** with realistic names and members
- **120+ Pitches** across all categories
- **Random Ratings** (3-8 votes per pitch)
- **Sample Feedback** with constructive comments
- **Mixed Status** (90% submitted, 10% draft)

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

**Test Coverage:** 50%+ across services and controllers

## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/startup-pitch
NODE_ENV=development
JWT_SECRET=your-secret-key
```

## 📱 Features by Role

### For Founders:
1. **Team Creation:** Add team members with roles
2. **Pitch Submission:** Submit one pitch per team
3. **Category Selection:** Choose from Fintech, Health, AI, Other
4. **Leaderboard Tracking:** Monitor team ranking

### For Reviewers:
1. **Pitch Discovery:** Browse and filter pitches
2. **Rating System:** 1-5 star ratings
3. **Feedback Submission:** Constructive comments
4. **Search Functionality:** Find pitches by title
5. **Category Filtering:** Focus on specific industries

## 🎨 UI/UX Features

- **Responsive Design:** Works on all devices
- **Modern UI:** Clean, professional interface
- **Real-time Updates:** Live leaderboard and ratings
- **Intuitive Navigation:** Role-based dashboards
- **Visual Feedback:** Star ratings, progress indicators
- **Error Handling:** User-friendly error messages

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use production MongoDB instance
3. Deploy to platforms like Heroku, AWS, or DigitalOcean

### Frontend Deployment
1. Run `npm run build`
2. Deploy `build` folder to static hosting
3. Update API URLs for production

## 🔧 Development Workflow

### Git Commands

```bash
# Initialize repository (already done)
git init

# Add all files to staging
git add .

# Commit changes
git commit -m "Initial commit: Startup Pitch Showcase"

# Add remote repository (replace with your repository URL)
git remote add origin <your-repository-url>

# Push to main branch
git push -u origin main

# Create and switch to feature branch
git checkout -b feature/new-feature

# Switch between branches
git checkout main
git checkout feature/new-feature

# Merge feature branch
git checkout main
git merge feature/new-feature

# Push feature branch
git push origin feature/new-feature
```

### Development Scripts

**Backend:**
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Generate seed data
npm test           # Run tests
```

**Frontend:**
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using Node.js, Express, MongoDB, and React**
