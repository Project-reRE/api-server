FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install

RUN npm run build:grpc-user
#RUN npm run build:rest-api-gateway

#CMD ["node","dist/apps/rest-api-gateway/main.js"]

CMD ["node","dist/apps/grpc-user/main.js"]


