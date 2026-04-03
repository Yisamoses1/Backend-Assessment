import {
  Controller,
} from '@nestjs/common'
import { WalletService } from './wallet.service'
import { GrpcMethod } from '@nestjs/microservices'
import { CreateWalletDto, CreditWalletDto, DebitWalletDto, GetWalletDto } from './dto'

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @GrpcMethod('WalletService', 'CreateWallet')
  create( data: CreateWalletDto) {
    return this.walletService.createWallet(data)
  }

  @GrpcMethod('WalletService', 'GetWallet')
  async getWallet( data: GetWalletDto) {
    return this.walletService.getWallet(data)
  }

  @GrpcMethod('WalletService', 'CreditWallet')
  async creditWallet(data: CreditWalletDto) {
    return this.walletService.creditWallet(data)
  }

  @GrpcMethod('WalletService', 'DebitWallet')
  async debitWallet(data: DebitWalletDto) {
    return this.walletService.debitWallet(data)
  }
}
