# IEDC Dashboard Setup Guide

## 🚀 Quick Deployment to Render

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy Steps:
1. Push your code to GitHub
2. Connect repository to Render
3. Configure environment variables
4. Deploy using `render.yaml`

## Prerequisites

### 1. Install MongoDB

- **Windows**: Download from https://www.mongodb.com/try/download/community
- **MacOS**: `brew install mongodb-community`
- **Linux**: Follow official MongoDB installation guide

### 2. Start MongoDB

```bash
# Windows (if installed as service)
net start MongoDB

# MacOS/Linux
mongod
```

### 3. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

## Configuration

1. Copy `server/config/.env` and update the values as needed
2. The default admin credentials are:
   - Email: admin@iedc.lbscek.ac.in
   - Password: admin123

## Running the Application

### 1. Seed the Database (First time only)

```bash
cd server
npm run seed
```

### 2. Start the Backend Server

```bash
cd server
npm run dev
```

Server will run on http://localhost:5000

### 3. Start the Frontend (in a new terminal)

```bash
cd client
npm run dev
```

Client will run on http://localhost:5173

## Test Credentials

After seeding the database, you can use these credentials to test:

- **Admin**: admin@iedc.lbscek.ac.in / admin123
- **Moderator**: moderator@iedc.lbscek.ac.in / mod123456
- **Member**: member@iedc.lbscek.ac.in / member123

## Features

- ✅ User Authentication (Login/Logout)
- ✅ Role-based Access Control (Admin, Moderator, Member)
- ✅ JWT Token Management
- ✅ Password Hashing
- ✅ Input Validation
- ✅ Rate Limiting
- ✅ Responsive Design
- ✅ Toast Notifications

## API Endpoints

### Authentication

- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration (admin only)
- GET `/api/auth/me` - Get current user
- POST `/api/auth/logout` - User logout

### Users

- GET `/api/users` - Get all users (admin/moderator only)
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user (admin only)

## Next Steps

1. Add more dashboard features (user management, analytics, etc.)
2. Implement email verification
3. Add password reset functionality
4. Create role-specific dashboards
5. Add file upload capabilities
6. Implement real-time notifications
