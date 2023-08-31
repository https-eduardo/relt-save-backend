import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserData } from './create-user-data.type';

export class UpdateUserData extends PartialType(
  OmitType(CreateUserData, ['email']),
) {}
