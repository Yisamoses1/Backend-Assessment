import { Controller, Post, Get, Body, Param, Inject, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom, Observable } from 'rxjs'

interface CreateUserRequest {
  email: string
  name: string
}

interface GetUserByIdRequest {
  id: string
}

interface UserResponse {
  id: string
  email: string
  name: string
  createdAt: string
}

interface UserServiceGrpc {
  createUser(data: CreateUserRequest): Observable<UserResponse>
  getUserById(data: GetUserByIdRequest): Observable<UserResponse>
}

@Controller('users')
export class UserController implements OnModuleInit {
  private userServiceGrpc: UserServiceGrpc

  constructor(@Inject('USER_SERVICE') private readonly userClient: ClientGrpc) {}

  onModuleInit() {
    this.userServiceGrpc = this.userClient.getService<UserServiceGrpc>('UserService')
  }

  @Post()
  async createUser(@Body() body: CreateUserRequest): Promise<UserResponse> {
    return await firstValueFrom(this.userServiceGrpc.createUser(body))
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponse> {
    return await firstValueFrom(this.userServiceGrpc.getUserById({ id }))
  }
}