# Use the official Node.js image.
FROM node:20-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy all files to the app directory
COPY . .

# Install app dependencies.
RUN npm install

# Build the app
RUN npm run build-rest-api-gateway

# Start the app
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

#CMD ["sh", "-c", "/wait && node dist/apps/rest-api-gateway/main"]

CMD node dist/apps/rest-api-gateway/main