import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { TransactionType } from '../types/transaction-type.enum';

export class FindTransactionByIdDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  transactionId: number;
}

export class FindTransactionByUserIdDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  userId: number;
}

export class FindTransactionFilterDto {
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  paid?: boolean;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @Transform(({ value }) => Number(value))
  @IsPositive()
  @IsOptional()
  categoryId?: number;

  @IsEnum(Prisma.SortOrder)
  @IsOptional()
  createdDateOrder?: Prisma.SortOrder;

  @IsEnum(Prisma.SortOrder)
  @IsOptional()
  valueOrder?: Prisma.SortOrder;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  minDate?: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  maxDate?: Date;
}
