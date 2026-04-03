import { IsNotEmpty, IsString } from "class-validator";

export class GetWalletDto {

  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string
}