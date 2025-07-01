@echo off
echo 🏗️  Building IEDC Website for production...

REM Build client
echo 📦 Building client...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Client npm install failed
    exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
    echo ❌ Client build failed
    exit /b 1
)

echo ✅ Client build successful

REM Build server (install dependencies)
echo 📦 Installing server dependencies...
cd ..\server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Server dependencies installation failed
    exit /b 1
)

echo ✅ Server dependencies installed

echo.
echo 🎉 Build completed successfully!
echo 📋 Next steps for deployment:
echo 1. Push code to GitHub
echo 2. Follow DEPLOYMENT.md guide
echo 3. Configure environment variables in Render
echo 4. Deploy using render.yaml

pause
