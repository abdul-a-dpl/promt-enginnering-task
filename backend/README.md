# Backend - Node.js Express MongoDB API

A RESTful API built with Node.js, Express, and MongoDB for user management.

## Features

- User CRUD operations (Create, Read, Update, Delete)
- MongoDB database integration
- CORS enabled for frontend communication
- RESTful API endpoints
- Input validation and error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myapp
NODE_ENV=development
```

4. Make sure MongoDB is running on your system

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 5000 (or the port specified in your .env file).

## API Endpoints

### Base URL
```
http://localhost:5000
```

### Endpoints

- `GET /` - Health check endpoint
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update user by ID
- `DELETE /api/users/:id` - Delete user by ID

### Example API Usage

#### Create a new user
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "age": 30}'
```

#### Get all users
```bash
curl http://localhost:5000/api/users
```

#### Update a user
```bash
curl -X PUT http://localhost:5000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@example.com", "age": 25}'
```

#### Delete a user
```bash
curl -X DELETE http://localhost:5000/api/users/USER_ID
```

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  age: Number (required),
  createdAt: Date,
  updatedAt: Date
}
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **body-parser** - Request body parsing
- **nodemon** - Development server (dev dependency)

## Project Structure

```
backend/
├── package.json
├── server.js
└── .env (create this file)
```

## Error Handling

The API includes comprehensive error handling for:
- Database connection errors
- Validation errors
- Not found errors
- Server errors

All errors are returned in JSON format with appropriate HTTP status codes.
