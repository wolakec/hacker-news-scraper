FROM node:8.12.0-alpine

WORKDIR /app

COPY . /app

RUN npm install
RUN npm link

ENTRYPOINT ["hackernews"]
