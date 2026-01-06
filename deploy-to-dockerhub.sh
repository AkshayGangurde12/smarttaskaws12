#!/bin/bash

# Deploy Smart Task Planner to Docker Hub
# Repository: akshaygangurde/smart_task

echo "🚀 Deploying Smart Task Planner to Docker Hub..."
echo "Repository: akshaygangurde/smart_task"

# Set variables
DOCKER_USERNAME="akshaygangurde"
REPO_NAME="smart_task"
TAG=${1:-"latest"}

echo "📦 Building images..."

# Build backend image
echo "Building backend..."
docker build -t ${DOCKER_USERNAME}/${REPO_NAME}-backend:${TAG} ./backend
if [ $? -ne 0 ]; then
    echo "❌ Backend build failed!"
    exit 1
fi

# Build frontend image
echo "Building frontend..."
docker build -t ${DOCKER_USERNAME}/${REPO_NAME}-frontend:${TAG} ./frontend
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "✅ Images built successfully!"

# Login to Docker Hub
echo "🔐 Please login to Docker Hub..."
docker login
if [ $? -ne 0 ]; then
    echo "❌ Docker Hub login failed!"
    exit 1
fi

# Push images
echo "📤 Pushing images to Docker Hub..."

echo "Pushing backend image..."
docker push ${DOCKER_USERNAME}/${REPO_NAME}-backend:${TAG}
if [ $? -ne 0 ]; then
    echo "❌ Backend push failed!"
    exit 1
fi

echo "Pushing frontend image..."
docker push ${DOCKER_USERNAME}/${REPO_NAME}-frontend:${TAG}
if [ $? -ne 0 ]; then
    echo "❌ Frontend push failed!"
    exit 1
fi

echo "🎉 Deployment successful!"
echo ""
echo "📋 Your images are now available at:"
echo "   Backend:  ${DOCKER_USERNAME}/${REPO_NAME}-backend:${TAG}"
echo "   Frontend: ${DOCKER_USERNAME}/${REPO_NAME}-frontend:${TAG}"
echo ""
echo "🚀 To run on any server:"
echo "   docker run -d -p 5000:5000 --env-file .env ${DOCKER_USERNAME}/${REPO_NAME}-backend:${TAG}"
echo "   docker run -d -p 80:80 ${DOCKER_USERNAME}/${REPO_NAME}-frontend:${TAG}"