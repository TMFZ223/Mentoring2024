FROM node:18
ENV AUTH_PORT ${AUTH_PORT}
WORKDIR /usr/src/app

COPY package.json ./
RUN npm i

USER node

COPY ./src .

EXPOSE ${AUTH_PORT}
CMD node web-server.js

