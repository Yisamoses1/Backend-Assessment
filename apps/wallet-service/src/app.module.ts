import { Module } from '@nestjs/common'
import { WalletModule } from './wallet/wallet.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { LoggerModule } from 'nestjs-pino'
import { join } from 'path'

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
    ]),
    WalletModule,
  ],
})
export class AppModule {}
