#!/bin/bash

echo "🆓 FREE IEDC Website Deployment to Vercel"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "client/package.json" ]; then
    echo "❌ Please run this from the project root directory"
    exit 1
fi

echo "📦 Installing Vercel CLI..."
npm install -g vercel

echo "🏗️  Building client..."
cd client
npm install
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "🚀 Deploying to Vercel..."
echo "Follow the prompts:"
echo "- Set up and deploy? Y"
echo "- Project name: iedc-website"
echo "- Override build settings? N"

vercel

echo ""
echo "✅ Frontend deployed to Vercel!"
echo ""
echo "🔧 Next steps for backend:"
echo "1. Go to https://railway.app"
echo "2. Sign up with GitHub"
echo "3. 'New Project' → 'Deploy from GitHub repo'"
echo "4. Select your iedc-website repository"
echo "5. Set Root Directory: 'server'"
echo "6. Add environment variables"
echo "7. Deploy"
echo ""
echo "📝 Don't forget to update VITE_API_URL with your Railway backend URL!"

read -p "Press Enter to continue..."
