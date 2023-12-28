import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { TransactionType } from '../transactions/types/transaction-type.enum';
import { Prisma } from '@prisma/client';
import { FindChargeFilterDto } from './dto/find-charge.dto';
import {
  ChargeByCategoryFetch,
  ChargeByCategoryResult,
} from './types/charge-by-category.type';

@Injectable()
export class ChargesService {
  constructor(private readonly prisma: PrismaService) {}

  async updatePaidDate(id: number, { paidAt }: UpdateChargeDto) {
    try {
      return this.prisma.charge.update({
        where: { id },
        data: { paid_at: paidAt },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async getChargesValue(
    userId: number,
    findChargeFilterDto: FindChargeFilterDto,
  ) {
    try {
      const filters = this.organizeFilters(findChargeFilterDto);
      const { _sum } = await this.prisma.charge.aggregate({
        where: { transaction: { user_id: userId }, ...filters },
        _sum: { value: true },
      });
      return _sum;
    } catch {
      throw new BadRequestException();
    }
  }

  async getChargesBalanceByCategory(
    userId: number,
    findChargeFilterDto: FindChargeFilterDto,
  ) {
    try {
      const filters = this.organizeFilters(findChargeFilterDto);
      const charges: ChargeByCategoryFetch[] =
        await this.prisma.charge.findMany({
          where: { transaction: { user_id: userId }, ...filters },
          select: {
            transaction: {
              select: { categories: true },
            },
            value: true,
          },
        });
      return this.groupByCategoryName(charges);
    } catch {
      throw new BadRequestException();
    }
  }

  private groupByCategoryName(charges: ChargeByCategoryFetch[]) {
    const WITHOUT_CATEGORY = 'Sem Categoria';
    const result: ChargeByCategoryResult[] = [];

    function getByName(name: string) {
      return result.find((categoryResult) => categoryResult.name === name);
    }

    for (const charge of charges) {
      if (charge.transaction.categories.length === 0) {
        const categoryResult = getByName(WITHOUT_CATEGORY);
        if (!categoryResult)
          result.push({
            name: WITHOUT_CATEGORY,
            value: charge.value,
          });
        else categoryResult.value += charge.value;
        continue;
      }

      charge.transaction.categories.forEach((category) => {
        const categoryResult = getByName(category.name);
        if (!categoryResult) {
          result.push({
            name: category.name,
            color: category.color,
            value: charge.value,
          });
        } else categoryResult.value += charge.value;
      });
    }
    return result.sort((r1, r2) => r2.value - r1.value);
  }

  private organizeFilters(filters: FindChargeFilterDto) {
    const { minDate, maxDate, paid, type } = filters;

    const valueFilter: Prisma.FloatFilter<'Charge'> =
      type === TransactionType.EXPENSES ? { lt: 0 } : { gte: 0 };

    const paidFilter: Prisma.DateTimeNullableFilter<'Charge'> = paid
      ? { not: null }
      : undefined;

    const fields: Prisma.ChargeWhereInput = {
      value: type !== undefined ? valueFilter : undefined,
      due_date: { gte: minDate, lte: maxDate },
      paid_at: paidFilter,
    };

    return fields;
  }
}
