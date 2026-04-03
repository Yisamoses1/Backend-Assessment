FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY packages/ ./packages/
COPY apps/user-service/ ./apps/user-service/

RUN npm install
RUN npx prisma generate --config=./packages/prisma/prisma.config.ts
RUN npm run build user-service

CMD ["sh", "-c", "npx prisma migrate deploy --config=./packages/prisma/prisma.config.ts && node dist/apps/user-service/main"]