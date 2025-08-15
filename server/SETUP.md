# Server Setup Guide for IEDC Registration

## 1. Environment Variables

Create a `.env` file in the `server/config` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/iedc-dashboard
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iedc-dashboard

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 2. MongoDB Setup

### Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create database: `use iedc-dashboard`

### MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

## 3. Cloudinary Setup

### Create Cloudinary Account

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Sign up for a free account
3. Get your credentials from the dashboard

### Configure Environment Variables

Update your `.env` file with Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Cloudinary Features

- **Free Tier**: 25 GB storage, 25 GB bandwidth/month
- **Image Optimization**: Automatic format conversion (WebP)
- **CDN**: Global content delivery network
- **Transformations**: Resize, crop, and optimize images

## 4. Install Dependencies

```bash
cd server
npm install
```

## 5. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 6. Test the API

The server will be running on `http://localhost:5000`

### Test Registration Endpoint

```bash
curl -X POST http://localhost:5000/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "1234567890",
    "admissionNo": "TEST001",
    "department": "Computer Science & Engineering",
    "year": "1st Year",
    "semester": "1st Semester",
    "interests": ["Web Development"],
    "motivation": "I want to join IEDC",
    "profilePhoto": "https://example.com/photo1.jpg",
    "idPhoto": "https://example.com/photo2.jpg"
  }'
```

## 7. Database Collections

The server will automatically create these collections:

- `registrations` - IEDC member registrations
- `users` - Admin users for dashboard
- `events` - IEDC events
- `eventproposals` - Proposed events

## 8. Admin Access

To access registration data, you need an admin user:

1. Create a user through the auth endpoint
2. Update the user's role to 'admin' in MongoDB:

```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } });
```

## 9. API Endpoints

### Registrations

- `POST /api/registrations` - Submit new registration
- `GET /api/registrations` - Get all registrations (admin only)
- `GET /api/registrations/:id` - Get specific registration (admin only)
- `PUT /api/registrations/:id/status` - Update status (admin only)
- `DELETE /api/registrations/:id` - Delete registration (admin only)

### Image Uploads

- `POST /api/upload/images` - Upload profile and ID photos to Cloudinary

### Authentication

- `POST /api/auth/register` - Register admin user
- `POST /api/auth/login` - Login
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

## 10. Validation

The server validates:

- Required fields
- Email format
- Phone number format
- Department and year/semester values
- Image files (type and size)
- Duplicate email and admission number checks

## 11. Error Handling

The server returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if any
}
```

## 12. Security Features

- Input validation and sanitization
- File type and size validation
- Rate limiting (100 requests per 15 minutes per IP)
- CORS protection
- Helmet security headers
- JWT authentication for protected routes

## 13. Monitoring

Check server logs for:

- Database connection status
- API request logs
- Image upload logs
- Error details
- Performance metrics

## Troubleshooting

- **MongoDB connection failed**: Check your connection string and network
- **Port already in use**: Change PORT in .env or kill existing process
- **CORS errors**: Verify CLIENT_URL in .env matches your frontend
- **Validation errors**: Check request body format and required fields
- **Image upload failed**: Verify Cloudinary credentials and file size/type
