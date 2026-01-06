@echo off
echo 🚀 Quick Deploy to Docker Hub - akshaygangurde/smart_task
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Desktop is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo ✅ Docker is running
echo.

REM Build backend
echo 📦 Building backend image...
docker build -t akshaygangurde/smart_task-backend:latest ./backend
if %errorlevel% neq 0 (
    echo ❌ Backend build failed!
    pause
    exit /b 1
)

REM Build frontend
echo 📦 Building frontend image...
docker build -t akshaygangurde/smart_task-frontend:latest ./frontend
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)

echo ✅ Images built successfully!
echo.

REM Login to Docker Hub
echo 🔐 Logging in to Docker Hub...
docker login
if %errorlevel% neq 0 (
    echo ❌ Docker Hub login failed!
    pause
    exit /b 1
)

REM Push backend
echo 📤 Pushing backend image...
docker push akshaygangurde/smart_task-backend:latest
if %errorlevel% neq 0 (
    echo ❌ Backend push failed!
    pause
    exit /b 1
)

REM Push frontend
echo 📤 Pushing frontend image...
docker push akshaygangurde/smart_task-frontend:latest
if %errorlevel% neq 0 (
    echo ❌ Frontend push failed!
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment successful!
echo.
echo 📋 Your images are now available at:
echo    Backend:  akshaygangurde/smart_task-backend:latest
echo    Frontend: akshaygangurde/smart_task-frontend:latest
echo.
echo 🚀 To run on any server:
echo    docker run -d -p 5000:5000 --env-file .env akshaygangurde/smart_task-backend:latest
echo    docker run -d -p 80:80 akshaygangurde/smart_task-frontend:latest
echo.
pause