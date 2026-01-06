# 🚀 Docker Hub Deployment Instructions

## Repository: akshaygangurde/smart_task

### Prerequisites
1. **Start Docker Desktop** - Make sure Docker Desktop is running
2. **Login to Docker Hub** - You'll need your Docker Hub credentials

### Step-by-Step Deployment

#### 1. Start Docker Desktop
Make sure Docker Desktop is running on your system.

#### 2. Build and Deploy (Automated)
Run the deployment script:
```bash
# Make script executable (if on Linux/Mac)
chmod +x deploy-to-dockerhub.sh

# Deploy with latest tag
./deploy-to-dockerhub.sh

# Or deploy with custom tag
./deploy-to-dockerhub.sh v1.0.0
```

#### 3. Manual Deployment (Alternative)

If you prefer manual steps:

```bash
# 1. Build images
docker build -t akshaygangurde/smart_task-backend:latest ./backend
docker build -t akshaygangurde/smart_task-frontend:latest ./frontend

# 2. Login to Docker Hub
docker login

# 3. Push images
docker push akshaygangurde/smart_task-backend:latest
docker push akshaygangurde/smart_task-frontend:latest
```

#### 4. Verify Deployment
After successful push, your images will be available at:
- Backend: `akshaygangurde/smart_task-backend:latest`
- Frontend: `akshaygangurde/smart_task-frontend:latest`

### 🌐 Running on Any Server

Once deployed to Docker Hub, anyone can run your application:

#### Using Docker Compose (Recommended)
```bash
# Download the production compose file
curl -O https://raw.githubusercontent.com/your-repo/smart-task-planner/main/docker-compose.prod.yml

# Create .env file with your environment variables
echo "MONGO_URI=your_mongodb_uri" > .env
echo "JWT_SECRET=your_jwt_secret" >> .env
echo "GROQ_API_KEY=your_groq_api_key" >> .env

# Run the application
docker-compose -f docker-compose.prod.yml up -d
```

#### Using Individual Docker Commands
```bash
# Run backend
docker run -d \
  --name smart-task-backend \
  -p 5000:5000 \
  -e MONGO_URI="your_mongodb_uri" \
  -e JWT_SECRET="your_jwt_secret" \
  -e GROQ_API_KEY="your_groq_api_key" \
  akshaygangurde/smart_task-backend:latest

# Run frontend
docker run -d \
  --name smart-task-frontend \
  -p 80:80 \
  --link smart-task-backend:backend \
  akshaygangurde/smart_task-frontend:latest
```

### 🔧 Environment Variables Required

Make sure to set these environment variables:

```env
MONGO_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
```

### 📱 Access Your Application

After deployment:
- **Frontend**: http://localhost (or your server IP)
- **Backend API**: http://localhost:5000 (or your server IP:5000)

### 🐛 Troubleshooting

#### Docker Desktop Not Running
```bash
# Check Docker status
docker --version
docker info
```

#### Build Failures
```bash
# Check Docker logs
docker logs <container_name>

# Rebuild with no cache
docker build --no-cache -t akshaygangurde/smart_task-backend:latest ./backend
```

#### Push Failures
```bash
# Re-login to Docker Hub
docker logout
docker login

# Check image exists locally
docker images | grep akshaygangurde
```

### 🎯 Next Steps

1. **Start Docker Desktop**
2. **Run the deployment script**: `./deploy-to-dockerhub.sh`
3. **Share your Docker Hub links** with others for easy deployment
4. **Set up CI/CD** for automatic deployments on code changes

Your application will be publicly available on Docker Hub for easy deployment anywhere!