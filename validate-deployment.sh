#!/bin/bash

echo "🔍 IEDC Website Deployment Validation"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found. Please run this from the project root directory."
    exit 1
fi

echo "✅ render.yaml found"

# Check package.json files
if [ ! -f "client/package.json" ]; then
    echo "❌ client/package.json not found"
    exit 1
fi

if [ ! -f "server/package.json" ]; then
    echo "❌ server/package.json not found"
    exit 1
fi

echo "✅ Package.json files found"

# Test client build
echo "🏗️  Testing client build..."
cd client
npm install --silent
if [ $? -ne 0 ]; then
    echo "❌ Client npm install failed"
    exit 1
fi

npm run build --silent
if [ $? -ne 0 ]; then
    echo "❌ Client build failed"
    exit 1
fi

echo "✅ Client build successful"

# Test server dependencies
echo "📦 Testing server dependencies..."
cd ../server
npm install --silent
if [ $? -ne 0 ]; then
    echo "❌ Server npm install failed"
    exit 1
fi

echo "✅ Server dependencies installed successfully"

# Check for required files
cd ..
files=(
    "render.yaml"
    "server/.env.example"
    "DEPLOYMENT.md"
    "DEPLOYMENT-CHECKLIST.md"
    "client/dist/index.html"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

echo ""
echo "🎉 All validation checks passed!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for Render deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to https://dashboard.render.com"
echo "3. Click 'New' → 'Blueprint'"
echo "4. Connect your GitHub repository"
echo "5. Set environment variables as described in DEPLOYMENT.md"
echo "6. Click 'Apply' to deploy"
echo ""
echo "🚀 Your IEDC website is ready for deployment!"
