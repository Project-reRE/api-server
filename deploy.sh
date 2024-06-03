
#!/bin/bash

# Navigate to the application directory
cd /home/ec2-user/app

# Stop any running containers
docker-compose down

# Pull the latest code
git pull origin main

# Build and start the containers
docker-compose up --build -d
