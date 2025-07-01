@echo off
echo 🔍 IEDC Website Deployment Validation
echo ======================================

REM Check if we're in the right directory
if not exist "render.yaml" (
    echo ❌ render.yaml not found. Please run this from the project root directory.
    exit /b 1
)

echo ✅ render.yaml found

REM Check package.json files
if not exist "client\package.json" (
    echo ❌ client\package.json not found
    exit /b 1
)

if not exist "server\package.json" (
    echo ❌ server\package.json not found
    exit /b 1
)

echo ✅ Package.json files found

REM Test client build
echo 🏗️  Testing client build...
cd client
call npm install --silent
if %errorlevel% neq 0 (
    echo ❌ Client npm install failed
    exit /b 1
)

call npm run build --silent
if %errorlevel% neq 0 (
    echo ❌ Client build failed
    exit /b 1
)

echo ✅ Client build successful

REM Test server dependencies
echo 📦 Testing server dependencies...
cd ..\server
call npm install --silent
if %errorlevel% neq 0 (
    echo ❌ Server npm install failed
    exit /b 1
)

echo ✅ Server dependencies installed successfully

REM Check for required files
cd ..
if exist "render.yaml" (echo ✅ render.yaml exists) else (echo ❌ render.yaml missing & exit /b 1)
if exist "server\.env.example" (echo ✅ server\.env.example exists) else (echo ❌ server\.env.example missing & exit /b 1)
if exist "DEPLOYMENT.md" (echo ✅ DEPLOYMENT.md exists) else (echo ❌ DEPLOYMENT.md missing & exit /b 1)
if exist "DEPLOYMENT-CHECKLIST.md" (echo ✅ DEPLOYMENT-CHECKLIST.md exists) else (echo ❌ DEPLOYMENT-CHECKLIST.md missing & exit /b 1)
if exist "client\dist\index.html" (echo ✅ client\dist\index.html exists) else (echo ❌ client\dist\index.html missing & exit /b 1)

echo.
echo 🎉 All validation checks passed!
echo.
echo 📋 Next steps:
echo 1. Push your code to GitHub:
echo    git add .
echo    git commit -m "Ready for Render deployment"
echo    git push origin main
echo.
echo 2. Go to https://dashboard.render.com
echo 3. Click 'New' → 'Blueprint'
echo 4. Connect your GitHub repository
echo 5. Set environment variables as described in DEPLOYMENT.md
echo 6. Click 'Apply' to deploy
echo.
echo 🚀 Your IEDC website is ready for deployment!

pause
