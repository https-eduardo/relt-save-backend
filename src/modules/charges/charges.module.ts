import { Module } from '@nestjs/common';
import { ChargesService } from './charges.service';
import { ChargesController } from './charges.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ChargesController],
  providers: [ChargesService],
  imports: [PrismaModule],
})
export class ChargesModule {}
