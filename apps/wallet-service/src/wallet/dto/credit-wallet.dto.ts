import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator'

export class CreditWalletDto {
  @IsInt({})
  @Min(0, { message: 'Balance must be a non-negative integer' })
  amount: number

  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string
}
