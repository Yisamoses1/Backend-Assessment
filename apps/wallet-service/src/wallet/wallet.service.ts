import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import prisma from '../../../../packages/prisma/prisma'
import { CreateWalletDto, CreditWalletDto, DebitWalletDto, GetWalletDto } from './dto'
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom, Observable } from 'rxjs'

interface UserServiceGrpc {
  getUserById(data: { id: string }): Observable<{
    id: string;
    email: string;
    name: string;
    createdAt: string
}>
}

@Injectable()
export class WalletService {
  constructor(
    @InjectPinoLogger(WalletService.name) private readonly logger: PinoLogger,
    @Inject('USER_SERVICE') private readonly userClient: ClientGrpc,
  ) {}

  private formatWallet(wallet) {
    return {
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance,
      createdAt: wallet.createdAt.toISOString(),
    }
  }

    private userServiceGrpc: UserServiceGrpc;

  onModuleInit() {
    this.userServiceGrpc = this.userClient.getService<UserServiceGrpc>('UserService');
  }

  async createWallet(dto: CreateWalletDto) {
  this.logger.info(`Creating wallet for user ${dto.userId}`);

   await firstValueFrom(
    this.userServiceGrpc.getUserById({ id: dto.userId }),
  )

  const existingWallet = await prisma.wallet.findUnique({
    where: { userId: dto.userId },
  });

  if (existingWallet) {
    this.logger.warn(`Wallet already exists for user ${dto.userId}`);
    throw new ConflictException(`Wallet for user ${dto.userId} already exists`);
  }

  const wallet = await prisma.wallet.create({
    data: { userId: dto.userId, balance: 0 },
  });

  this.logger.info(`Created wallet ${wallet.id} for user ${dto.userId}`);
  return this.formatWallet(wallet);
}


  async creditWallet(dto: CreditWalletDto) {
    this.logger.info(
      `Crediting wallet of user ${dto.userId} with amount ${dto.amount}`,
    )

    const wallet = await prisma.wallet.findUnique({
      where: { userId: dto.userId },
    })

    if (!wallet) {
      throw new NotFoundException(`Wallet for user ${dto.userId} not found`)
    }

    const updatedWallet = await prisma.wallet.update({
      where: { userId: dto.userId },
      data: { balance: { increment: dto.amount } },
    })
    this.logger.info(`Credited ${dto.amount} to wallet of user ${dto.userId}`)
    return this.formatWallet(updatedWallet)
  }

  async debitWallet(dto: DebitWalletDto) {
    this.logger.info(
      `Debiting wallet of user ${dto.userId} with amount ${dto.amount}`,
    )

    const updatedWallet = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { userId: dto.userId },
      })
      if (!wallet) {
        this.logger.error(`No wallet found for user ${dto.userId}`)
        throw new NotFoundException(`Wallet for user ${dto.userId} not found`)
      }

      if (wallet.balance < dto.amount) {
        this.logger.warn(
          `Insufficient funds: user ${dto.userId} tried to debit ${dto.amount}`,
        )
        throw new BadRequestException(
          `Insufficient balance. Current balance: ${wallet.balance}, requested: ${dto.amount}`,
        )
      }

      return tx.wallet.update({
        where: { userId: dto.userId },
        data: { balance: { decrement: dto.amount } },
      })
    })

    this.logger.info(`Debited ${dto.amount} from wallet of user ${dto.userId}`)
    return this.formatWallet(updatedWallet)
  }

  async getWallet(dto: GetWalletDto) {
    const wallet = await prisma.wallet.findUnique({ where: { userId: dto.userId } })

    if (!wallet) {
      this.logger.warn(`Wallet for user ${dto.userId} not found`)
      throw new NotFoundException(`Wallet for user ${dto.userId} not found`)
    }

    this.logger.info(`Wallet found for user ${dto.userId}`)
    return this.formatWallet(wallet)
  }
}
