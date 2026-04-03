FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY packages/ ./packages/
COPY apps/user-service/ ./apps/user-service/

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npm install --include=dev
RUN npx prisma generate --schema=./packages/prisma/schema.prisma
RUN npm run build user-service

CMD ["sh", "-c", "npx prisma migrate deploy --config=./packages/prisma/prisma.config.ts && node dist/apps/user-service/main"]