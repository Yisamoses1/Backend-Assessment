FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY packages/ ./packages/
COPY apps/user-service/ ./apps/user-service/

RUN npm install --include=dev
RUN npx prisma generate --schema=./packages/prisma/schema.prisma
RUN npm run build:user-service

CMD ["node", "dist/apps/user-service/main.js"]
