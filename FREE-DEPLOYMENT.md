# 🆓 FREE Deployment Guide for IEDC Website

## 💡 Alternative Free Deployment Options

Since Render is requesting payment information, here are several **completely free** alternatives:

### Option 1: Manual Deployment on Render (FREE)

**Skip the Blueprint, create services manually:**

1. **Create Backend Service (FREE)**:

   - Go to [render.com](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - **Service Name**: `iedcapi`
   - **Runtime**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Select "Free" (0$/month)
   - Add environment variables

2. **Create Frontend Service (FREE)**:
   - Click "New" → "Static Site"
   - Connect the same repository
   - **Site Name**: `iedcweb`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`
   - **Plan**: Select "Free" (0$/month)
   - Add `VITE_API_URL` environment variable

### Option 2: Vercel + Railway (COMPLETELY FREE)

#### Frontend on Vercel (FREE Forever):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from client directory
cd client
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: iedc-website
# - Directory: ./
# - Override settings? N
```

#### Backend on Railway (FREE Tier):

1. Go to [railway.app](https://railway.app)
2. "Start a new project" → "Deploy from GitHub repo"
3. Select your repository
4. **Root Directory**: `/server`
5. Add environment variables
6. Deploy

### Option 3: Netlify + Render (FREE)

#### Frontend on Netlify (FREE):

1. Go to [netlify.com](https://netlify.com)
2. "Add new site" → "Import an existing project"
3. Connect GitHub
4. **Build command**: `cd client && npm run build`
5. **Publish directory**: `client/dist`
6. Deploy

#### Backend on Render (FREE):

- Single service deployment (no blueprint needed)

### Option 4: Complete Free Stack

#### Use these FREE services:

- **Frontend**: Vercel or Netlify (FREE forever)
- **Backend**: Railway or Render (FREE tier)
- **Database**: MongoDB Atlas (FREE 512MB)
- **Email**: Gmail SMTP (FREE)
- **File Storage**: Cloudinary (FREE tier)

## 🎯 Recommended: Vercel + Railway Setup

### Step 1: Deploy Frontend to Vercel

```bash
# From your project root
cd client
npm install
npm run build

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL
# Enter: https://your-backend-url.up.railway.app
```

### Step 2: Deploy Backend to Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **"New Project" → "Deploy from GitHub repo"**
4. **Select your iedc-website repository**
5. **Configure**:

   - **Root Directory**: `/server`
   - **Start Command**: `npm start`
   - **Build Command**: `npm install`

6. **Add Environment Variables**:

   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_SERVICE=gmail
   PORT=3000
   ```

7. **Deploy** - Railway will automatically deploy

### Step 3: Update Frontend with Backend URL

```bash
# Update environment variable in Vercel
vercel env rm VITE_API_URL
vercel env add VITE_API_URL
# Enter your Railway backend URL: https://xxx.up.railway.app

# Redeploy
vercel --prod
```

## 🆓 FREE Tier Limitations

| Service           | Free Tier Limits                          |
| ----------------- | ----------------------------------------- |
| **Vercel**        | 100GB bandwidth/month, 6000 build minutes |
| **Railway**       | $5 credit/month, 512MB RAM, 1GB disk      |
| **Netlify**       | 100GB bandwidth/month, 300 build minutes  |
| **MongoDB Atlas** | 512MB storage, shared clusters            |
| **Cloudinary**    | 25GB storage, 25GB bandwidth              |

## 🛠️ Quick Free Deployment Script

Create `deploy-free.sh`:

```bash
#!/bin/bash
echo "🆓 Deploying IEDC Website to FREE services..."

# Deploy frontend to Vercel
echo "📦 Deploying frontend to Vercel..."
cd client
npm install
npm run build
npx vercel --prod

# Instructions for backend
echo "🔧 Next steps for backend:"
echo "1. Go to https://railway.app"
echo "2. Create new project from GitHub"
echo "3. Select your repository"
echo "4. Set root directory to 'server'"
echo "5. Add environment variables"
echo "6. Deploy!"

echo "✅ Frontend deployed! Backend instructions provided."
```

## 💡 Pro Tips for Free Deployment

1. **Use Short Service Names**: Shorter names = better URLs
2. **Optimize Build Time**: Use caching, smaller dependencies
3. **Monitor Usage**: Track your free tier limits
4. **Set Up Monitoring**: Use free monitoring tools
5. **Use CDN**: Vercel and Netlify include free CDN

## 🎯 Best Free Combination

**Recommended Setup**:

- **Frontend**: Vercel (fastest, reliable)
- **Backend**: Railway (easy setup, good free tier)
- **Database**: MongoDB Atlas (industry standard)
- **Domain**: Vercel provides free subdomain

**Total Cost**: $0/month 🎉

## 🚀 One-Click Deploy Options

### Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/iedc-website&project-name=iedc-website&root-directory=client)

### Deploy to Railway:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/your-username/iedc-website&plugins=mongodb&envs=JWT_SECRET,EMAIL_USER,EMAIL_PASS)

---

## ✅ **DEPLOYMENT SUCCESS - RENDER + VERCEL**

**🎉 Your IEDC website is now deployed for FREE!**

### Deployed URLs:

- **Frontend (Vercel)**: https://iedclbscek-paq9kbe2w-umar-al-mukhtar-s-projects.vercel.app
- **Backend (Render)**: https://iedclbscekapi.onrender.com
- **API Health**: https://iedclbscekapi.onrender.com/api/health
- **Team API**: https://iedclbscekapi.onrender.com/api/users/public-team

### Configuration Applied:

- ✅ Frontend deployed to Vercel (FREE tier)
- ✅ Backend deployed to Render (FREE tier)
- ✅ Environment variables configured properly
- ✅ CORS configured for Vercel domain
- ✅ API endpoints working perfectly
- ✅ MongoDB connected successfully
- ✅ Server running on port 5000

### Render vs Railway:

- ✅ Render worked immediately with better configuration
- ✅ More reliable free tier deployment
- ✅ Better logging and debugging
- ✅ Automatic SSL certificates

---

**🎉 Choose your preferred free option and deploy your IEDC website at zero cost!**
