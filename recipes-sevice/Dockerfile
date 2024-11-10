FROM node:18
ENV NODE_ENV production
ENV POSTGRES_USER ${POSTGRES_USER}
ENV POSTGRES_PASSWORD ${POSTGRES_PASSWORD}
WORKDIR /usr/src/app

COPY package.json ./
RUN npm i --omit=dev

USER node

COPY ./src .

EXPOSE 7000
CMD node web-server.js

