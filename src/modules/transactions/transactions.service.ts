import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FindTransactionFilterDto } from './dto/find-transaction.dto';
import { PaymentType, Prisma } from '@prisma/client';
import { TransactionType } from './types/transaction-type.enum';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createTransactionDto: CreateTransactionDto) {
    const {
      name,
      description,
      categories,
      paymentType,
      value,
      dueDate,
      installments,
      cardId,
      createdAt,
      bankAccountId,
    } = createTransactionDto;

    const categoriesConnections = categories
      ? categories.map((id) => ({ id }))
      : undefined;

    const card = cardId ? { connect: { id: cardId } } : undefined;

    const bankAccount = bankAccountId
      ? { connect: { id: bankAccountId } }
      : undefined;

    const charges = [];

    for (let installment = 0; installment < installments; installment++) {
      const dueDate = createdAt ?? new Date();
      dueDate.setMonth(dueDate.getMonth() + installment);
      const charge: Prisma.ChargeCreateManyInput = {
        due_date: dueDate,
        value: value / installments,
      };
      charges.push(charge);
    }

    try {
      return await this.prisma.transaction.create({
        data: {
          user: { connect: { id: userId } },
          name,
          description,
          categories: { connect: categoriesConnections },
          charges: { createMany: { data: charges } },
          bank_account: bankAccount,
          payment_type: paymentType,
          value,
          due_date: dueDate,
          installments,
          card,
          created_at: createdAt,
        },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findByUserId(
    userId: number,
    findTransactionFilter: FindTransactionFilterDto,
  ) {
    const { orderBy, fields } = this.organizeFilters(findTransactionFilter);
    try {
      return await this.prisma.transaction.findMany({
        include: {
          card: true,
          categories: true,
          charges: true,
        },
        orderBy,
        where: { user_id: userId, ...fields },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findOne(transactionId: number) {
    try {
      return await this.prisma.transaction.findUnique({
        include: {
          card: { include: { bank_account: true } },
          charges: true,
          bank_account: true,
          categories: true,
        },
        where: { id: transactionId },
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async updateOne(
    transactionId: number,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const {
      name,
      description,
      categories,
      paymentType,
      value,
      dueDate,
      installments,
      cardId,
      bankAccountId,
      createdAt,
    } = updateTransactionDto;
    const categoriesConnections = categories
      ? categories.map((id) => ({ id }))
      : undefined;

    let card: Prisma.CardUpdateOneWithoutTransactionsNestedInput = cardId
      ? { connect: { id: cardId } }
      : undefined;
    let bankAccount: Prisma.BankAccountUpdateOneWithoutTransactionsNestedInput =
      bankAccountId ? { connect: { id: bankAccountId } } : undefined;
    if (paymentType !== PaymentType.CARD) card = { disconnect: true };
    if (paymentType !== PaymentType.BALANCE) bankAccount = { disconnect: true };

    try {
      return await this.prisma.transaction.update({
        data: {
          name,
          description,
          categories: { connect: categoriesConnections },
          payment_type: paymentType,
          value,
          due_date: dueDate,
          bank_account: bankAccount,
          installments,
          card,
          created_at: createdAt,
        },
        where: { id: transactionId },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async deleteOne(transactionId: number) {
    try {
      return await this.prisma.transaction.delete({
        where: { id: transactionId },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  private organizeFilters(filters: FindTransactionFilterDto) {
    const {
      createdDateOrder,
      valueOrder,
      minDate,
      maxDate,
      type,
      categoryId,
      paid,
    } = filters;

    const orderBy: Prisma.TransactionOrderByWithRelationInput = {
      value: valueOrder,
      created_at: createdDateOrder ?? 'desc',
    };

    const valueFilter: Prisma.FloatFilter<'Transaction'> =
      type === TransactionType.EXPENSES ? { lt: 0 } : { gte: 0 };

    let paidAtFilter: Prisma.ChargeListRelationFilter = paid
      ? { every: { paid_at: { not: null } } }
      : { every: { paid_at: null } };

    if (typeof paid === 'undefined') paidAtFilter = undefined;

    const fields: Prisma.TransactionWhereInput = {
      value: type !== undefined ? valueFilter : undefined,
      categories: categoryId ? { some: { id: categoryId } } : undefined,
      charges: {
        ...paidAtFilter,
        some: { due_date: { gte: minDate, lte: maxDate } },
      },
    };

    return { orderBy, fields };
  }
}
