# Use the official Node.js image.
FROM node:14

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install app dependencies.
COPY package*.json ./
RUN npm install

# Copy the app code.
COPY apps/grpc-user ./

# Build the app
RUN npm run build grpc-user

# Start the app
CMD [ "node", "dist/main.js" ]
