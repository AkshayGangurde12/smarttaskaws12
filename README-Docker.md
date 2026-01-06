# Smart Task Planner - Docker Deployment Guide

## 🐳 Docker Setup

This project is now fully containerized with Docker and ready for deployment to Docker Hub.

### Prerequisites

- Docker installed on your system
- Docker Compose installed
- Docker Hub account (for publishing)

### Quick Start

1. **Clone and navigate to the project:**
   ```bash
   git clone <your-repo>
   cd smart-task-planner
   ```

2. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000

### Manual Build Process

#### Build Individual Images

```bash
# Build backend
docker build -t smart-task-planner-backend ./backend

# Build frontend  
docker build -t smart-task-planner-frontend ./frontend
```

#### Run Individual Containers

```bash
# Run backend
docker run -d -p 5000:5000 --env-file .env smart-task-planner-backend

# Run frontend
docker run -d -p 80:80 smart-task-planner-frontend
```

### Docker Hub Deployment

#### 1. Tag Your Images

```bash
# Replace 'yourusername' with your Docker Hub username
docker tag smart-task-planner-backend yourusername/smart-task-planner-backend:latest
docker tag smart-task-planner-frontend yourusername/smart-task-planner-frontend:latest
```

#### 2. Login to Docker Hub

```bash
docker login
```

#### 3. Push Images

```bash
docker push yourusername/smart-task-planner-backend:latest
docker push yourusername/smart-task-planner-frontend:latest
```

#### 4. Use the Build Script (Automated)

```bash
# Make script executable (Linux/Mac)
chmod +x docker-build.sh

# Run the script
./docker-build.sh
```

### Environment Variables

Make sure to set these environment variables in your `.env` file:

```env
GROQ_API_KEY=your_groq_api_key
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Production Deployment

For production deployment, you can pull and run the images directly:

```bash
# Create docker-compose.prod.yml
version: '3.8'
services:
  backend:
    image: yourusername/smart-task-planner-backend:latest
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
      - GROQ_API_KEY=${GROQ_API_KEY}
  
  frontend:
    image: yourusername/smart-task-planner-frontend:latest
    ports:
      - "80:80"
    depends_on:
      - backend
```

Then run:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Architecture

- **Backend**: Node.js/Express API running on port 5000
- **Frontend**: React/Vite app served by Nginx on port 80
- **Database**: MongoDB (external connection via MONGO_URI)
- **Networking**: Internal Docker network for service communication

### Health Checks

Both services include health checks:
- Backend: HTTP check on port 5000
- Frontend: Nginx status check

### Security Features

- Non-root user in containers
- Security headers in Nginx
- Gzip compression enabled
- API proxy configuration for CORS handling

### Troubleshooting

#### Check container logs:
```bash
docker-compose logs backend
docker-compose logs frontend
```

#### Restart services:
```bash
docker-compose restart
```

#### Rebuild after changes:
```bash
docker-compose up --build
```

### Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove images
docker rmi smart-task-planner-backend smart-task-planner-frontend

# Remove all unused containers, networks, images
docker system prune -a
```