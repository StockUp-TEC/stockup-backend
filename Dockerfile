FROM node:20-alpine

ENV APP_HOME=/app

WORKDIR ${APP_HOME}
COPY . ${APP_HOME}

RUN npm install

CMD ["npm", "run", "start"]
