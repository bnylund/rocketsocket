FROM node:16

WORKDIR /app

COPY . .

ENV RLHOST 'ws://host.docker.internal:49122'
ENV RCONHOST 'ws://host.docker.internal:9002'
ENV CORS *

RUN npm ci --loglevel=error

ENV NODE_ENV production

EXPOSE 5000

CMD [ "node", "server.js" ]