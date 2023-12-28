import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindCardByIdDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  cardId: number;
}

export class FindCardsByBankAccountIdDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  bankAccountId: number;
}
