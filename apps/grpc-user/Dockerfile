FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install
RUN npm run build

RUN npm run build:grpc-user