# Use the official Node.js image.
FROM node:14

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy all files to the app directory
COPY . .

# Install app dependencies.
RUN npm install

# Build the app
RUN npm run build-rest-api-gateway

# Start the app
CMD [ "node", "dist/apps/rest-api-gateway/main.js" ]
