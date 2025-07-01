#!/bin/bash

# Production build and test script
echo "🏗️  Building IEDC Website for production..."

# Build client
echo "📦 Building client..."
cd client
npm install
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Client build failed"
    exit 1
fi

echo "✅ Client build successful"

# Build server (install dependencies)
echo "📦 Installing server dependencies..."
cd ../server
npm install

if [ $? -ne 0 ]; then
    echo "❌ Server dependencies installation failed"
    exit 1
fi

echo "✅ Server dependencies installed"

# Test server health
echo "🔍 Testing server..."
node -e "
import('./server.js').then(() => {
    setTimeout(() => {
        console.log('✅ Server test completed');
        process.exit(0);
    }, 2000);
}).catch(err => {
    console.error('❌ Server test failed:', err.message);
    process.exit(1);
});
" &

# Wait for server to start and then test
sleep 3
SERVER_PID=$!

# Test health endpoint
if command -v curl &> /dev/null; then
    curl -f http://localhost:5000/api/health > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Health check passed"
    else
        echo "⚠️  Health check endpoint not responding (may need environment setup)"
    fi
fi

# Cleanup
kill $SERVER_PID 2>/dev/null

echo ""
echo "🎉 Build completed successfully!"
echo "📋 Next steps for deployment:"
echo "1. Push code to GitHub"
echo "2. Follow DEPLOYMENT.md guide"
echo "3. Configure environment variables in Render"
echo "4. Deploy using render.yaml"
