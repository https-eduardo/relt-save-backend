import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user-data.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email']),
) {}
