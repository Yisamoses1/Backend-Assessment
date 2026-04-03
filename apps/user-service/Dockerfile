FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
RUN npm install --include=dev

COPY . .

RUN npx prisma generate --schema=./packages/prisma/schema.prisma
RUN npm run build:user-service

CMD ["node", "dist/apps/user-service/main.js"]
