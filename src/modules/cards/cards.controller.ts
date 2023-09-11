import {
  Param,
  Body,
  Controller,
  Patch,
  Post,
  Get,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import {
  FindCardByIdDto,
  FindCardsByBankAccountIdDto,
} from './dto/find-card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly service: CardsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createCardDto: CreateCardDto) {
    return await this.service.create(createCardDto);
  }

  @Patch(':cardId')
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Param() { cardId }: FindCardByIdDto,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return await this.service.update(cardId, updateCardDto);
  }
  @Get(':cardId')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param() { cardId }: FindCardByIdDto) {
    return await this.service.findOne(cardId);
  }

  @Get(':bankAccountId')
  @UseGuards(JwtAuthGuard)
  async findByBankAccountId(
    @Param() { bankAccountId }: FindCardsByBankAccountIdDto,
  ) {
    return await this.service.findByBankAccountId(bankAccountId);
  }

  @Delete(':cardId')
  @UseGuards(JwtAuthGuard)
  async deleteOne(@Param() { cardId }: FindCardByIdDto) {
    return await this.service.delete(cardId);
  }
}
