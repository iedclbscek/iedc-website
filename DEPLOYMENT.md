# IEDC Website Deployment Guide for Render

This guide will help you deploy the IEDC website to Render.com with both frontend and backend services.

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to a GitHub repository
2. **Render Account**: Create a free account at [render.com](https://render.com)
3. **MongoDB Atlas**: Set up a MongoDB database (free tier available)
4. **Email Service**: Configure email service (Gmail with App Password recommended)

## Step 1: Prepare Your Environment Variables

You'll need to set up the following environment variables in Render:

### For the Backend (iedc-api-server):

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string for JWT tokens
- `EMAIL_USER` - Your email address for sending emails
- `EMAIL_PASS` - Your email app password
- `EMAIL_SERVICE` - Email service provider (e.g., "gmail")
- `EMAIL_FROM` - Sender name and email
- `NODE_ENV` - Set to "production"

### For the Frontend (iedclbscek):

- `VITE_API_URL` - This will be automatically set to your backend URL

## Step 2: Deploy to Render

### Method 1: Using render.yaml (Recommended)

1. **Connect Repository**:

   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository containing your IEDC website

2. **Configure Blueprint**:

   - Render will automatically detect the `render.yaml` file
   - Review the services that will be created:
     - `iedc-api-server` (Backend API)
     - `iedclbscek` (Frontend Static Site)

3. **Set Environment Variables**:

   **For `iedc-api-server` service:**

   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iedc-dashboard
   JWT_SECRET=your-super-secure-random-string-64-characters-long
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   EMAIL_SERVICE=gmail
   EMAIL_FROM="IEDC LBSCEK" <noreply@iedclbscek.com>
   ```

   **For `iedclbscek` service:**

   ```
   VITE_API_URL=https://iedc-api-server.onrender.com
   ```

   (Replace with your actual backend service URL)

4. **Deploy**:
   - Click "Apply" to start the deployment
   - Both services will be deployed simultaneously

### Method 2: Manual Service Creation

If you prefer to create services manually:

#### Backend API Server:

1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `iedc-api-server`
   - **Runtime**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Health Check Path**: `/api/health`
4. Add environment variables
5. Click "Create Web Service"

#### Frontend Static Site:

1. Click "New" → "Static Site"
2. Connect the same repository
3. Configure:
   - **Name**: `iedclbscek`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`
4. Add environment variable `VITE_API_URL` (set to your backend URL)
5. Click "Create Static Site"

## Step 3: Configure MongoDB Atlas

1. **Create Cluster**:

   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster (free tier available)
   - Choose your preferred region

2. **Configure Network Access**:

   - Go to "Network Access"
   - Add IP address `0.0.0.0/0` (allows access from anywhere)
   - Or add specific Render IP ranges if preferred

3. **Create Database User**:

   - Go to "Database Access"
   - Create a new user with read/write permissions
   - Note the username and password

4. **Get Connection String**:
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Step 4: Configure Email Service

### Gmail Setup:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Use in Environment Variables**:
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: The generated app password
   - `EMAIL_SERVICE`: "gmail"

## Step 5: Update Environment Variables in Render

1. Go to your backend service in Render dashboard
2. Click "Environment"
3. Add all required environment variables:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iedc-dashboard
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_SERVICE=gmail
EMAIL_FROM="IEDC LBSCEK" <noreply@iedclbscek.com>
NODE_ENV=production
```

## Step 6: Verify Deployment

1. **Check Service Health**:

   - Backend: Visit `https://your-backend-url.onrender.com/api/health`
   - Should return JSON with status "OK"

2. **Test Frontend**:

   - Visit your frontend URL
   - Verify it loads correctly
   - Test API connections

3. **Test Functionality**:
   - User registration/login
   - Profile picture upload
   - Team management features
   - Email invitations

## Troubleshooting

### Common Issues:

1. **Build Failures**:

   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify build commands are correct

2. **Environment Variables**:

   - Double-check all required variables are set
   - Ensure no typos in variable names
   - Verify MongoDB connection string format

3. **CORS Issues**:

   - Ensure frontend URL is properly configured in backend
   - Check that both services are deployed and running

4. **File Upload Issues**:
   - Note: Render's free tier has ephemeral storage
   - Consider using cloud storage (AWS S3, Cloudinary) for production

### Performance Optimization:

1. **Enable Gzip Compression**: Already configured in server
2. **Static Asset Caching**: Configured in render.yaml
3. **Database Indexing**: Ensure proper indexes in MongoDB
4. **Image Optimization**: Consider implementing image compression

## Post-Deployment

1. **Custom Domain**: You can add a custom domain in Render dashboard
2. **SSL Certificate**: Automatically provided by Render
3. **Monitoring**: Use Render's built-in monitoring tools
4. **Logs**: Monitor application logs for any issues

## Cost Considerations

- **Render Free Tier**: Limited compute hours per month
- **MongoDB Atlas Free Tier**: 512MB storage limit
- **Upgrade Path**: Consider paid plans for production usage

## Support

If you encounter issues:

1. Check Render documentation
2. Review application logs
3. Test locally first
4. Contact Render support if needed

---

Your IEDC website should now be successfully deployed on Render! 🚀
