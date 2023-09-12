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
import { BudgetsService } from './budgets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUserPayload } from 'src/common/types/user-payload.type';
import {
  FindBudgetByIdDto,
  FindBudgetByUserIdDto,
} from './dto/find-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly service: BudgetsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @User() user: JwtUserPayload,
    @Body() createBudgetDto: CreateBudgetDto,
  ) {
    return await this.service.create(user.id, createBudgetDto);
  }

  @Patch(':budgetId')
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Param() { budgetId }: FindBudgetByIdDto,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return await this.service.update(budgetId, updateBudgetDto);
  }

  @Get(':budgetId')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param() { budgetId }: FindBudgetByIdDto) {
    return await this.service.findOne(budgetId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findByUserId(@User() user: JwtUserPayload) {
    return await this.service.findOne(user.id);
  }

  @Delete(':budgetId')
  @UseGuards(JwtAuthGuard)
  async deleteOne(@Param() { budgetId }: FindBudgetByIdDto) {
    return await this.service.delete(budgetId);
  }
}
