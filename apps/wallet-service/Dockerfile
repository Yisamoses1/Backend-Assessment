FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
RUN npm install --include=dev

COPY . .

RUN npx prisma generate --schema=./packages/prisma/schema.prisma
RUN npm run build:wallet-service
RUN cp -r packages/generated dist/apps/wallet-service/packages/

CMD ["sh", "-c", "npx prisma migrate deploy --config=./packages/prisma/prisma.config.ts && node dist/apps/wallet-service/apps/wallet-service/src/main.js"]