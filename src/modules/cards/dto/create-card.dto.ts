import { CardType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumberString()
  @MaxLength(4)
  @MinLength(4)
  finalNumbers: string;

  @IsEnum(CardType)
  type: CardType;

  @IsNumber()
  bankAccountId: number;
}
