import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';

export class UpdateCardDto extends PartialType(
  OmitType(CreateCardDto, ['bankAccountId']),
) {}
