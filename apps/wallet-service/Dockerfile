FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
RUN apk add --no-cache ca-certificates
RUN npm config set registry https://registry.npmjs.org/
RUN npm install --include=dev

COPY . .

RUN npx prisma generate --schema=./packages/prisma/schema.prisma
RUN npm run build:wallet-service
RUN ls -R dist/apps/wallet-service

CMD ["node", "dist/apps/wallet-service/main.js"]
