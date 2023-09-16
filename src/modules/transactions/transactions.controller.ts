import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUserPayload } from 'src/common/types/user-payload.type';
import {
  FindTransactionByIdDto,
  FindTransactionFilterDto,
} from './dto/find-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @User() user: JwtUserPayload,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return await this.service.create(user.id, createTransactionDto);
  }

  @Patch(':transactionId')
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Param() { transactionId }: FindTransactionByIdDto,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return await this.service.updateOne(transactionId, updateTransactionDto);
  }

  @Get(':transactionId')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param() { transactionId }: FindTransactionByIdDto) {
    return await this.service.findOne(transactionId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findByUserId(
    @User() user: JwtUserPayload,
    @Query() findTransactionFilterDto: FindTransactionFilterDto,
  ) {
    return await this.service.findByUserId(user.id, findTransactionFilterDto);
  }

  @Delete(':transactionId')
  @UseGuards(JwtAuthGuard)
  async deleteOne(@Param() { transactionId }: FindTransactionByIdDto) {
    return await this.service.deleteOne(transactionId);
  }
}
