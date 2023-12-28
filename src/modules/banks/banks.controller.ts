import { Controller, Get, UseGuards } from '@nestjs/common';
import { BanksService } from './banks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('banks')
export class BanksController {
  constructor(private readonly service: BanksService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.service.findAll();
  }
}
