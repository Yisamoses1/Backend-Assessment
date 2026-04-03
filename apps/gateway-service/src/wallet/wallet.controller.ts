import { Controller, Post, Get, Body, Param, Inject, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom, Observable } from 'rxjs'

interface CreateWalletRequest {
  userId: string
}

interface GetWalletRequest {
  userId: string
}

interface CreditWalletRequest {
  userId: string
  amount: number
}

interface DebitWalletRequest {
  userId: string
  amount: number
}

interface WalletResponse {
  id: string
  userId: string
  balance: number
  createdAt: string
}

interface WalletServiceGrpc {
  createWallet(data: CreateWalletRequest): Observable<WalletResponse>
  getWallet(data: GetWalletRequest): Observable<WalletResponse>
  creditWallet(data: CreditWalletRequest): Observable<WalletResponse>
  debitWallet(data: DebitWalletRequest): Observable<WalletResponse>
}

@Controller('wallets')
export class WalletController implements OnModuleInit {
  private walletServiceGrpc: WalletServiceGrpc

  constructor(@Inject('WALLET_SERVICE') private readonly walletClient: ClientGrpc) {}

  onModuleInit() {
    this.walletServiceGrpc = this.walletClient.getService<WalletServiceGrpc>('WalletService')
  }

  @Post()
  async createWallet(@Body() body: CreateWalletRequest): Promise<WalletResponse> {
    return await firstValueFrom(this.walletServiceGrpc.createWallet(body))
  }

  @Get(':userId')
  async getWallet(@Param('userId') userId: string): Promise<WalletResponse> {
    return await firstValueFrom(this.walletServiceGrpc.getWallet({ userId }))
  }

  @Post('credit')
  async creditWallet(@Body() body: CreditWalletRequest): Promise<WalletResponse> {
    return await firstValueFrom(this.walletServiceGrpc.creditWallet(body))
  }

  @Post('debit')
  async debitWallet(@Body() body: DebitWalletRequest): Promise<WalletResponse> {
    return await firstValueFrom(this.walletServiceGrpc.debitWallet(body))
  }
}