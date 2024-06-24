# Use the official Node.js image.
FROM node:14

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install app dependencies.
COPY package*.json ./
COPY apps ./apps
COPY nest-cli.json ./
COPY *.json ./
COPY libs ./libs
COPY grpc-idl/* ./grpc-idl/*
COPY grpc-stub/* ./grpc-stub/*

RUN npm install

# Copy the app code.
COPY apps/rest-api-gateway ./

# Build the app
RUN npm run build-rest-api-gateway

# Start the app
CMD [ "node", "dist/apps/rest-api-gateway/main.js" ]