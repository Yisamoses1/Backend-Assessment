import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { LoggerModule } from 'nestjs-pino'
import { join } from 'path'
import { UserController } from './user/user.controller'
import { WalletController } from './wallet/wallet.controller'

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      },
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(process.cwd(), 'packages/proto/user.proto'),
          url: process.env.USER_SERVICE_URL,
        },
      },
      {
        name: 'WALLET_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'wallet',
          protoPath: join(process.cwd(), 'packages/proto/wallet.proto'),
          url: process.env.WALLET_SERVICE_URL,
        },
      },
    ]),
  ],
  controllers: [UserController, WalletController],
})
export class AppModule {}