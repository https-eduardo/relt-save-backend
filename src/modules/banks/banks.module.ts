import { Module } from '@nestjs/common';
import { BanksService } from './banks.service';
import { BanksController } from './banks.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [BanksController],
  imports: [PrismaModule],
  providers: [BanksService],
})
export class BanksModule {}
