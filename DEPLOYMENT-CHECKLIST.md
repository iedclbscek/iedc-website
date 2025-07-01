# IEDC Website Deployment Checklist

## ✅ Pre-Deployment Checklist

### Code Preparation:

- [x] `render.yaml` configured for both frontend and backend
- [x] Health check endpoint added (`/api/health`)
- [x] CORS configuration updated for production
- [x] `.env.example` file created with all required variables
- [x] Node.js engines specified in package.json files
- [x] Production build scripts tested locally

### Repository Setup:

- [ ] Code pushed to GitHub repository
- [ ] Repository is public or accessible to Render
- [ ] All sensitive files excluded via `.gitignore`

### External Services:

- [ ] MongoDB Atlas cluster created and configured
- [ ] Database user created with appropriate permissions
- [ ] Network access configured (0.0.0.0/0 or specific IPs)
- [ ] Email service configured (Gmail App Password recommended)

### Environment Variables Ready:

- [ ] `MONGODB_URI` - Database connection string
- [ ] `JWT_SECRET` - Secure random string (64+ characters)
- [ ] `EMAIL_USER` - Email address for sending emails
- [ ] `EMAIL_PASS` - Email service app password
- [ ] `EMAIL_SERVICE` - Email provider (e.g., "gmail")
- [ ] `EMAIL_FROM` - Sender name and email format
- [ ] `NODE_ENV` - Set to "production"

## 🚀 Deployment Steps

### Option 1: Blueprint Deployment (Recommended)

1. [ ] Go to [Render Dashboard](https://dashboard.render.com)
2. [ ] Click "New" → "Blueprint"
3. [ ] Connect GitHub repository
4. [ ] Review services in `render.yaml`
5. [ ] Add environment variables for backend service
6. [ ] Click "Apply" to deploy

### Option 2: Manual Service Creation

1. [ ] Create backend web service
2. [ ] Create frontend static site
3. [ ] Configure environment variables
4. [ ] Link services together

## 🔍 Post-Deployment Verification

### Backend Verification:

- [ ] Visit `https://your-backend-url.onrender.com/api/health`
- [ ] Should return JSON with status "OK"
- [ ] Check service logs for any errors

### Frontend Verification:

- [ ] Visit your frontend URL
- [ ] Verify homepage loads correctly
- [ ] Test navigation between pages
- [ ] Check browser console for errors

### Full Application Testing:

- [ ] User registration works
- [ ] Email invitations sent successfully
- [ ] Login/logout functionality
- [ ] Profile picture upload
- [ ] Team management features
- [ ] Database operations work

## 🔧 Troubleshooting Quick Fixes

### Build Failures:

- Check build logs in Render dashboard
- Verify package.json scripts
- Ensure all dependencies are listed

### Environment Variable Issues:

- Double-check variable names (case-sensitive)
- Verify MongoDB connection string format
- Test email credentials separately

### CORS Problems:

- Ensure frontend URL is properly configured
- Check that both services are deployed and running
- Verify CORS origins in server configuration

### Database Connection Issues:

- Check MongoDB Atlas network access settings
- Verify database user permissions
- Test connection string locally first

## 📱 Production Monitoring

### Regular Checks:

- [ ] Monitor service uptime in Render dashboard
- [ ] Check application logs regularly
- [ ] Monitor database usage in MongoDB Atlas
- [ ] Review email delivery rates

### Performance Optimization:

- [ ] Monitor loading times
- [ ] Check for console errors
- [ ] Optimize images if needed
- [ ] Consider implementing caching strategies

## 🎯 Success Indicators

Your deployment is successful when:

- ✅ Both services show "Live" status in Render
- ✅ Health check endpoint returns 200 OK
- ✅ Frontend loads without errors
- ✅ User registration and login work
- ✅ Email invitations are sent
- ✅ File uploads work correctly
- ✅ Team management functions properly

## 📞 Support Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [React Production Build Guide](https://reactjs.org/docs/optimizing-performance.html)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

**Ready to Deploy? 🚀**

Follow the steps above and your IEDC website will be live on Render!
