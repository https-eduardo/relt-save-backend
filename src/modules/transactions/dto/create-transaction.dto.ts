import { PaymentType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsPositive({ each: true })
  @IsOptional()
  categories: number[];

  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @IsPositive()
  @IsOptional()
  cardId?: number;

  @IsPositive()
  @IsOptional()
  bankAccountId?: number;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  dueDate?: Date;

  @IsPositive()
  @IsOptional()
  installments?: number;

  @IsNumber()
  value: number;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  paidAt?: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  createdAt?: Date;
}
