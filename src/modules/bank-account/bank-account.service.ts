import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@Injectable()
export class BankAccountService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createBankAccountDto: CreateBankAccountDto) {
    const { name, balance, bankId } = createBankAccountDto;
    try {
      return await this.prisma.bankAccount.create({
        data: {
          name,
          balance,
          bank: { connect: { id: bankId } },
          user: { connect: { id: userId } },
        },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async update(
    bankAccountId: number,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    const { name, balance, bankId } = updateBankAccountDto;
    const updateData: Record<string, any> = {
      name,
      balance,
    };
    if (bankId) updateData.bank = { connect: { id: bankId } };

    try {
      return await this.prisma.bankAccount.update({
        where: { id: bankAccountId },
        data: updateData,
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findOne(bankAccountId: number) {
    try {
      return await this.prisma.bankAccount.findUnique({
        where: { id: bankAccountId },
        include: { bank: true, cards: true },
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async findByUserId(userId: number) {
    try {
      return await this.prisma.bankAccount.findMany({
        where: { user_id: userId },
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async delete(bankAccountId: number) {
    try {
      return await this.prisma.bankAccount.delete({
        where: { user_id: bankAccountId },
      });
    } catch {
      throw new NotFoundException();
    }
  }
}
