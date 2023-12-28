import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Query,
  Body,
  Param,
} from '@nestjs/common';
import { ChargesService } from './charges.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUserPayload } from 'src/common/types/user-payload.type';
import { FindChargeByIdDto, FindChargeFilterDto } from './dto/find-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';

@Controller('charges')
export class ChargesController {
  constructor(private readonly chargesService: ChargesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getChargesValue(
    @User() user: JwtUserPayload,
    @Query() findChargeFilterDto: FindChargeFilterDto,
  ) {
    return await this.chargesService.getChargesValue(
      user.id,
      findChargeFilterDto,
    );
  }

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  async getChargesBalanceByCategory(
    @User() user: JwtUserPayload,
    @Query() findChargeFilterDto: FindChargeFilterDto,
  ) {
    return await this.chargesService.getChargesBalanceByCategory(
      user.id,
      findChargeFilterDto,
    );
  }

  @Patch(':chargeId')
  @UseGuards(JwtAuthGuard)
  async markAsPaid(
    @Param() { chargeId }: FindChargeByIdDto,
    @Body() updateChargeDto: UpdateChargeDto,
  ) {
    return await this.chargesService.updatePaidDate(chargeId, updateChargeDto);
  }
}
