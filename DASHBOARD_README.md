# IEDC Dashboard System

A comprehensive MERN stack dashboard for IEDC with user management, role-based access control, and team invitation system.

## Features

### 🔐 Authentication System

- **Username-based login** (not email-based)
- **Role-based access control** (admin, nodal_officer, ceo, lead, co_lead, coordinator, member)
- **Password reset functionality**
- **JWT-based authentication**

### 👥 Team Management

- **Invitation system** for team members
- **Email-based invitations** with secure token links
- **User status management** (activate/deactivate)
- **Role assignment** and team role management
- **User profile management**

### 📧 Email System

- **Automated invitation emails** via Nodemailer
- **Password reset emails**
- **Secure token-based verification**

### 🎯 Role-Based Features

- **Admin & Nodal Officer**: Full team management capabilities
- **All Users**: Personal dashboard and profile management
- **Hierarchical role system** with appropriate permissions

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- SMTP email configuration

### Installation

1. **Clone the repository**

   ```bash
   cd iedc-website
   ```

2. **Backend Setup**

   ```bash
   cd server
   npm install
   ```

3. **Frontend Setup**

   ```bash
   cd client
   npm install
   ```

4. **Environment Configuration**

   Update `server/config/.env`:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_email_password
   FROM_EMAIL=noreply@iedc.lbscek.ac.in
   FROM_NAME=IEDC LBS CEK

   # Admin Configuration
   ADMIN_USERNAME=admin
   ADMIN_EMAIL=admin@iedc.lbscek.ac.in
   ADMIN_PASSWORD=admin123
   ```

   Create `client/.env`:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

5. **Database Seeding**

   ```bash
   cd server
   npm run seed
   ```

6. **Start Development Servers**

   Backend (from server directory):

   ```bash
   npm run dev
   ```

   Frontend (from client directory):

   ```bash
   npm run dev
   ```

## Usage

### 🚀 Getting Started

1. **Access the application**: http://localhost:5173
2. **Login to dashboard**: http://localhost:5173/login

### 🔑 Default Credentials

After seeding the database, use these credentials:

| Role          | Username         | Password    |
| ------------- | ---------------- | ----------- |
| Admin         | `admin`          | `admin123`  |
| Nodal Officer | `sarith_divakar` | `sarith123` |
| CEO           | `abdul_afuw`     | `afuw123`   |

### 👥 Inviting Team Members

1. **Login as Admin or Nodal Officer**
2. **Navigate to "Team Management" tab**
3. **Click "Invite Member"**
4. **Fill in the team member details**
5. **Click "Send Invitation"**

The invited user will receive an email with a secure link to set up their account.

### 🔧 Setting Up Account (Invited Users)

1. **Check email for invitation link**
2. **Click on the invitation link**
3. **Choose a username and password**
4. **Complete account setup**
5. **Login with new credentials**

### 📊 Dashboard Features

#### For All Users:

- **Overview**: Personal dashboard with role information
- **Profile**: View and manage personal information
- **Quick Actions**: Navigation shortcuts

#### For Admin & Nodal Officers:

- **Team Management**:
  - View all team members
  - Send invitations
  - Activate/deactivate users
  - Monitor user status

## 🏗️ Project Structure

```
iedc-website/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── data/          # Static data
│   └── public/            # Static assets
└── server/                # Express backend
    ├── config/           # Configuration files
    ├── middleware/       # Express middleware
    ├── models/           # MongoDB models
    ├── routes/           # API routes
    └── utils/            # Utility functions
```

## 🔐 Security Features

- **Password hashing** with bcrypt
- **JWT token authentication**
- **Rate limiting** on auth routes
- **Input validation** and sanitization
- **Secure token generation** for invitations
- **Role-based route protection**

## 📝 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/invite` - Send invitation (Admin/Nodal Officer)
- `POST /api/auth/set-password` - Set password from invitation
- `GET /api/auth/validate-invitation/:token` - Validate invitation token
- `GET /api/auth/me` - Get current user

### User Management

- `GET /api/users/team` - Get all team members (Admin/Nodal Officer)
- `PATCH /api/users/:id/status` - Update user status (Admin/Nodal Officer)

## 🌟 Key Features Implemented

✅ **Username-based authentication**  
✅ **Role-based access control**  
✅ **Email invitation system**  
✅ **Team management dashboard**  
✅ **User status management**  
✅ **Secure password setup flow**  
✅ **Responsive dashboard UI**  
✅ **Profile management**

## 🔧 Development

### Available Scripts

**Server:**

- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with initial users
- `npm start` - Start production server

**Client:**

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🚀 Deployment

1. **Set environment variables** for production
2. **Build the frontend**: `npm run build` in client directory
3. **Deploy backend** to your preferred platform
4. **Configure SMTP** for email functionality
5. **Set up MongoDB** production database

## 📞 Support

For any issues or questions, please contact the IEDC development team.

---

**Built with ❤️ by IEDC LBS College of Engineering Kasaragod**
