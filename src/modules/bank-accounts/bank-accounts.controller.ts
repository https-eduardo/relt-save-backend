import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FindBankAccountByIdDto } from './dto/find-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUserPayload } from 'src/common/types/user-payload.type';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly service: BankAccountsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @User() user: JwtUserPayload,
    @Body() createBankAccountDto: CreateBankAccountDto,
  ) {
    return await this.service.create(user.id, createBankAccountDto);
  }

  @Patch(':bankAccountId')
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Param() { bankAccountId }: FindBankAccountByIdDto,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
  ) {
    return await this.service.update(bankAccountId, updateBankAccountDto);
  }

  @Get(':bankAccountId')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param() { bankAccountId }: FindBankAccountByIdDto) {
    return await this.service.findOne(bankAccountId);
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  async findByUserId(@User() user: JwtUserPayload) {
    return await this.service.findByUserId(user.id);
  }

  @Delete(':bankAccountId')
  @UseGuards(JwtAuthGuard)
  async deleteOne(@Param() { bankAccountId }: FindBankAccountByIdDto) {
    return await this.service.delete(bankAccountId);
  }
}
