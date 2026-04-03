FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY packages/ ./packages/
COPY apps/wallet-service/ ./apps/wallet-service/

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npm install --include=dev
RUN npx prisma generate --config=./packages/prisma/prisma.config.ts
RUN npm run build wallet-service

CMD ["sh", "-c", "npx prisma migrate deploy --config=./packages/prisma/prisma.config.ts && node dist/apps/wallet-service/main"]