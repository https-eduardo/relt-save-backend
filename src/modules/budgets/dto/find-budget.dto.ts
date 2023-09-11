import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindBudgetByIdDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  budgetId: number;
}

export class FindBudgetByUserIdDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  userId: number;
}
