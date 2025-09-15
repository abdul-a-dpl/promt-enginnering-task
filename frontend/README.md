# Frontend - React User Management App

A modern React application that communicates with the Node.js backend API for user management.

## Features

- Modern, responsive UI design
- User CRUD operations (Create, Read, Update, Delete)
- Real-time data fetching from backend API
- Form validation and error handling
- Loading states and user feedback
- Beautiful gradient design with hover effects

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on port 5000

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Features Overview

### User Management
- **Add Users**: Create new users with name, email, and age
- **View Users**: Display all users in a responsive card layout
- **Edit Users**: Update existing user information
- **Delete Users**: Remove users with confirmation dialog

### UI Components
- **Header**: Beautiful gradient header with app title
- **Form**: Clean form for adding/editing users
- **User Cards**: Individual cards for each user with action buttons
- **Loading States**: Loading indicators during API calls
- **Error/Success Messages**: User feedback for all operations

### Responsive Design
- Mobile-friendly layout
- Grid system that adapts to screen size
- Touch-friendly buttons and inputs

## API Integration

The frontend communicates with the backend API using Axios:

- **Base URL**: `http://localhost:5000/api`
- **CORS**: Configured to work with the backend
- **Error Handling**: Comprehensive error handling for all API calls

### API Endpoints Used
- `GET /api/users` - Fetch all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Technologies Used

- **React** - Frontend framework
- **Axios** - HTTP client for API calls
- **CSS3** - Styling with modern features
- **React Hooks** - State management (useState, useEffect)

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
└── package.json
```

## Styling Features

- **Gradient Backgrounds**: Modern gradient designs
- **Card Layout**: Clean card-based design
- **Hover Effects**: Interactive hover animations
- **Responsive Grid**: Auto-adjusting grid layout
- **Color Scheme**: Professional color palette
- **Typography**: Clean, readable fonts

## Development Notes

### Proxy Configuration
The `package.json` includes a proxy configuration:
```json
"proxy": "http://localhost:5000"
```

This allows the React development server to proxy API requests to the backend.

### State Management
The app uses React hooks for state management:
- `useState` for local component state
- `useEffect` for side effects (API calls)

### Error Handling
- Network errors are caught and displayed to users
- Form validation prevents invalid submissions
- Loading states provide user feedback

## Getting Started

1. Make sure the backend API is running on port 5000
2. Start the React development server:
   ```bash
   npm start
   ```
3. Open your browser to `http://localhost:3000`
4. Start managing users!

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
