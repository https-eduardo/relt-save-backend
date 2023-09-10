import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindBankAccountByIdDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  bankAccountId: number;
}
