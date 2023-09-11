import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBankAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  balance: number;

  @IsNumber()
  bankId: number;
}
