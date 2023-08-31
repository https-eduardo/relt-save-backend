import { Controller } from '@nestjs/common';
import { SpendingsService } from './spendings.service';

@Controller('spendings')
export class SpendingsController {
  constructor(private readonly spendingsService: SpendingsService) {}
}
