import { Controller, Body, Param } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { GrpcMethod } from '@nestjs/microservices'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateUser')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto)
  }

  @GrpcMethod('UserService', 'GetUserById')
  async getUserById(data: { id: string}) {
    return await this.userService.getUserById(data.id)
  }
}
