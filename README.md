# Backend Assessment — Microservice Wallet System

A monorepo containing two NestJS microservices communicating via gRPC, backed by PostgreSQL and Prisma ORM.

---

## Architecture

```
backend-assessment/
├── apps/
│   ├── user-service/       # Manages users — gRPC on port 50055
│   └── wallet-service/     # Manages wallets — gRPC on port 50056
├── packages/
│   ├── proto/              # Shared .proto files
│   │   ├── user.proto
│   │   └── wallet.proto
│   └── prisma/             # Shared Prisma schema
│       └── schema.prisma
└── README.md
```

### Inter-Service Communication
Wallet Service calls User Service via gRPC to verify a user exists before creating a wallet.
To avoid getting into issue of manually creating wallet for users, I created a wallet for the user immediately they sign up provided that they can't have more than 1 wallet

---

## Prerequisites

- Node.js >= 18
- PostgreSQL running locally
- npm

---

## Setup

### 1. Clone and install dependencies
```bash
git clone <your-repo-url>
cd backend-assessment
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Update DATABASE_URL in .env with your PostgreSQL credentials
```

### 3. Run Prisma migrations
```bash
cd packages/prisma
npx prisma migrate dev --name init --schema=./schema.prisma || npm run db:migrate
npx prisma generate --schema=./schema.prisma || npm run db:generate
```

---

## Running the Services

### User Service (port 50051)
```bash
npm run user ( on the root folder)
```

### Wallet Service (port 50052)
```bash
npm run wallet ( on the root folder)
```

> Start User Service first — Wallet Service connects to it on startup.

---

## Example Requests (curl / grpcurl)

### Create a User
```bash
grpcurl -plaintext -d '{"email": "john@example.com", "name": "John Doe"}' \
  localhost:50055 user.UserService/CreateUser
```

### Get User by ID
```bash
grpcurl -plaintext -d '{"id": "<user-id>"}' \
  localhost:50055 user.UserService/GetUserById
```

### Create Wallet
```bash
grpcurl -plaintext -d '{"userId": "<user-id>"}' \
  localhost:50056 wallet.WalletService/CreateWallet
```

### Get Wallet
```bash
grpcurl -plaintext -d '{"userId": "<user-id>"}' \
  localhost:50056 wallet.WalletService/GetWallet
```

### Credit Wallet
```bash
grpcurl -plaintext -d '{"userId": "<user-id>", "amount": 5000}' \
  localhost:50056 wallet.WalletService/CreditWallet
```

### Debit Wallet
```bash
grpcurl -plaintext -d '{"userId": "<user-id>", "amount": 1000}' \
  localhost:50056 wallet.WalletService/DebitWallet
```

---

## Features Implemented

### Core
- User Service with `CreateUser` and `GetUserById` gRPC endpoints
- Wallet Service with `CreateWallet`, `GetWallet`, `CreditWallet`, `DebitWallet` gRPC endpoints
- Inter-service gRPC communication — Wallet verifies user exists before wallet creation

### Bonus
- **Prisma `$transaction`** — DebitWallet uses an atomic transaction to check balance and debit safely
- **class-validator** — All DTOs validated with decorators
- **Error Handling** — User not found, insufficient balance, duplicate wallet/user
- **Structured Logging** — nestjs-pino on both services

---

## Prisma Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  wallet    Wallet?
}

model Wallet {
  id        String   @id @default(uuid())
  userId    String   @unique
  balance   Float    @default(0)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```


### postman link for reference

```
https://.postman.co/workspace/My-Workspace~ce342de9-293d-4f1e-8b08-d1eaa008bdc8/collection/69ce916b70af29bd24ef4cc0?action=share&creator=32752842

```