FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
RUN npm install --include=dev

COPY . .

RUN npx prisma generate --schema=./packages/prisma/schema.prisma
RUN npm run build:user-service
RUN find /app/dist -name "main.js" 2>/dev/null || echo "No main.js found in dist"

CMD ["sh", "-c", "npx prisma migrate deploy --config=./packages/prisma/prisma.config.ts && node dist/apps/user-service/src/main.js"]