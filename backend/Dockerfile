FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install -g @nestjs/cli
RUN npm install
COPY ecosystem.config.js .
COPY . .

RUN npm install -g pm2
RUN npm run build
CMD sh -c 'while [ ! -f dist/main.js ]; do echo "⏳ waiting for dist/main.js..."; sleep 1; done && pm2-runtime ecosystem.config.js'

