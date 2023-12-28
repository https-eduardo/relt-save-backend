import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { TransactionType } from 'src/modules/transactions/types/transaction-type.enum';

export class FindChargeByIdDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  chargeId: number;
}

export class FindChargeFilterDto {
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  paid?: boolean;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  minDate?: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  maxDate?: Date;
}
