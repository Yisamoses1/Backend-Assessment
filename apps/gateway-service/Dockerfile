FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY packages/ ./packages/
COPY apps/gateway-service/ ./apps/gateway-service/

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npm install --include=dev
RUN npm run build gateway-service

CMD ["node", "dist/apps/gateway-service/main"]