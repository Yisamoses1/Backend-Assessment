import { Module } from '@nestjs/common'
import { WalletService } from './wallet.service'
import { WalletController } from './wallet.controller'
import { LoggerModule } from 'nestjs-pino'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { join } from 'path'

@Module({
  imports: [
    LoggerModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(process.cwd(), 'packages/proto/user.proto'),
          url: 'localhost:50055',
        },
      },
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
