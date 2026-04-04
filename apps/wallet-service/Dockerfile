FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
RUN npm install --include=dev

COPY . .

RUN npx prisma generate --schema=./packages/prisma/schema.prisma
RUN npm run build:wallet-service

CMD ["sh", "-c", "npx prisma migrate deploy --schema=./packages/prisma/schema.prisma && node dist/apps/wallet-service/main.js"]
