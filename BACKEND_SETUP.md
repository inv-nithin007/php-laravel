# Laravel Backend Setup Guide

## Overview
This Laravel backend runs in a Docker container to avoid PHP extension dependency issues on systems without sudo access.

## Prerequisites
- Docker installed and running
- Access to this project directory

## Initial Setup (One-time)

### 1. Navigate to Project Directory
```bash
cd ~/school-m
```

### 2. Create and Start the Backend Container
```bash
docker run -d --name laravel-backend -p 8000:80 -v $(pwd):/var/www/html -w /var/www/html php:8.3-cli php -S 0.0.0.0:80 -t public/
```

## Daily Operations

### Start the Backend
```bash
docker start laravel-backend
```

### Stop the Backend
```bash
docker stop laravel-backend
```

### Check if Backend is Running
```bash
docker ps | grep laravel-backend
```

### View Backend Logs
```bash
docker logs laravel-backend
```

### Access the Application
- **Web Interface**: http://localhost:8000
- **API Base URL**: http://localhost:8000/api/

## Available API Endpoints

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|------------------------|
| POST | /api/auth/register | User registration | No |
| POST | /api/auth/login | User login | No |
| GET | /api/auth/me | Get current user | Yes |
| POST | /api/auth/logout | User logout | Yes |
| GET | /api/students | List all students | Yes |
| POST | /api/students | Create new student | Yes |
| GET | /api/students/{id} | Get specific student | Yes |
| PUT/PATCH | /api/students/{id} | Update student | Yes |
| DELETE | /api/students/{id} | Delete student | Yes |
| GET | /api/teachers | List all teachers | Yes |
| POST | /api/teachers | Create new teacher | Yes |
| GET | /api/teachers/{id} | Get specific teacher | Yes |
| PUT/PATCH | /api/teachers/{id} | Update teacher | Yes |
| DELETE | /api/teachers/{id} | Delete teacher | Yes |

## Troubleshooting

### Container Already Exists Error
If you get "container name already in use" error:
```bash
# Stop and remove existing container
docker stop laravel-backend
docker rm laravel-backend

# Recreate container
docker run -d --name laravel-backend -p 8000:80 -v $(pwd):/var/www/html -w /var/www/html php:8.3-cli php -S 0.0.0.0:80 -t public/
```

### Port 8000 Already in Use
Check what's using port 8000:
```bash
lsof -i :8000
```

Kill the process or use a different port:
```bash
docker run -d --name laravel-backend -p 8001:80 -v $(pwd):/var/www/html -w /var/www/html php:8.3-cli php -S 0.0.0.0:80 -t public/
```

### Backend Not Responding
1. Check container status:
   ```bash
   docker ps -a | grep laravel-backend
   ```

2. Check logs for errors:
   ```bash
   docker logs laravel-backend
   ```

3. Restart container:
   ```bash
   docker restart laravel-backend
   ```

### Complete Reset
To start fresh:
```bash
cd ~/school-m
docker stop laravel-backend 2>/dev/null
docker rm laravel-backend 2>/dev/null
docker run -d --name laravel-backend -p 8000:80 -v $(pwd):/var/www/html -w /var/www/html php:8.3-cli php -S 0.0.0.0:80 -t public/
```

## Testing the Backend

### Test Basic Functionality
```bash
# Test if backend is responding
curl http://localhost:8000

# Test API endpoint (should return 401 Unauthorized - this is correct)
curl http://localhost:8000/api/students
```

### Test Registration (Example)
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "password123",
    "role": "student"
  }'
```

## Database Information
- **Type**: SQLite
- **Location**: `database/database.sqlite`
- **No additional setup required**

## Why Docker?
This project uses Docker because the system lacks required PHP extensions:
- `php-dom`
- `php-mbstring` 
- `php-xml`

Docker provides a complete PHP environment with all necessary extensions pre-installed, avoiding the need for sudo access to install system packages.

## Support
If you encounter issues:
1. Check the troubleshooting section above
2. Verify Docker is running: `docker --version`
3. Ensure you're in the correct directory: `pwd` should show `/home/nithinkrishna/school-m`

---
**Status**: ✅ Backend is ready for development and testing!