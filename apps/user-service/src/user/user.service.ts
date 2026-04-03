import { Injectable, Logger } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import prisma from '../../../../packages/prisma/prisma'
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino'

@Injectable()
export class UserService {
  constructor(
    @InjectPinoLogger(UserService.name) private readonly logger: PinoLogger,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    this.logger.info({ email: createUserDto.email }, 'Creating user')
    const user = await prisma.user.findUnique({
      where: { email: createUserDto.email },
    })

    if (user) {
      this.logger.error('User with this email already exists')
      throw new Error('User with this email already exists')
    }

    const newUser = await prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        wallet: {
          create: {
            balance: 0,
          },
        },
      },
    })
    this.logger.info({ userId: newUser.id }, 'User created successfully')
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt.toISOString(),
    }
  }

  async getUserById( id: string) {
    this.logger.info({ id }, 'Fetching user by ID')
    const user = await prisma.user.findUnique({
      where: { id: id },
    })
    if (!user) {
      this.logger.warn({ id }, 'User not found')
      throw new Error('User not found')
    }
    this.logger.info({ id: user.id }, 'User found successfully')

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
    }
  }
}
