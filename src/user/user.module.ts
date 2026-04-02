import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { LoggerModule } from 'nestjs-pino'

@Module({
  imports: [LoggerModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
