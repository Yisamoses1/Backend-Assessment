FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
RUN npm install --include=dev

COPY . .

RUN npm run build:gateway-service

CMD ["node", "dist/apps/gateway-service/src/main.js"]