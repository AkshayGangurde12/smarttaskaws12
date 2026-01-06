#!/bin/bash

# Docker build and deployment script for Smart Task Planner

echo "🚀 Building Smart Task Planner Docker Images..."

# Build images
echo "📦 Building backend image..."
docker build -t smart-task-planner-backend ./backend

echo "📦 Building frontend image..."
docker build -t smart-task-planner-frontend ./frontend

echo "✅ Build complete!"

# Optional: Tag for Docker Hub (replace 'yourusername' with your Docker Hub username)
read -p "Do you want to tag images for Docker Hub? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter your Docker Hub username: " username
    
    echo "🏷️  Tagging images for Docker Hub..."
    docker tag smart-task-planner-backend $username/smart-task-planner-backend:latest
    docker tag smart-task-planner-frontend $username/smart-task-planner-frontend:latest
    
    echo "📤 Pushing to Docker Hub..."
    docker push $username/smart-task-planner-backend:latest
    docker push $username/smart-task-planner-frontend:latest
    
    echo "✅ Images pushed to Docker Hub!"
fi

echo "🎉 All done! You can now run: docker-compose up -d"