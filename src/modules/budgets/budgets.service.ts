import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createBudgetDto: CreateBudgetDto) {
    const { name, description, value, dueDate } = createBudgetDto;
    try {
      return await this.prisma.budget.create({
        data: {
          name,
          description,
          value,
          due_date: dueDate,
          user: { connect: { id: userId } },
        },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async update(budgetId: number, updateBudgetDto: UpdateBudgetDto) {
    const { name, description, dueDate: due_date, value } = updateBudgetDto;
    try {
      return await this.prisma.budget.update({
        data: {
          name,
          description,
          value,
          due_date,
        },
        where: { id: budgetId },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findOne(budgetId: number) {
    try {
      return await this.prisma.budget.findUnique({
        where: { id: budgetId },
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async findByUserId(userId: number) {
    try {
      return await this.prisma.budget.findMany({
        where: { user_id: userId },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async delete(budgetId: number) {
    try {
      return await this.prisma.budget.delete({ where: { id: budgetId } });
    } catch {
      throw new BadRequestException();
    }
  }
}
