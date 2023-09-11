import { CardType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Max(9999)
  @Min(0)
  finalNumbers: number;

  @IsEnum(CardType)
  type: CardType;

  @IsNumber()
  bankAccountId: number;
}
