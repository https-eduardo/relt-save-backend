import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCardDto: CreateCardDto) {
    const { name, finalNumbers, type, bankAccountId } = createCardDto;
    try {
      return await this.prisma.card.create({
        data: {
          name,
          final_numbers: finalNumbers,
          type,
          bank_account_id: bankAccountId,
        },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async update(cardId: number, updateCardDto: UpdateCardDto) {
    const { name, finalNumbers: final_numbers, type } = updateCardDto;
    try {
      return await this.prisma.card.update({
        data: {
          name,
          final_numbers,
          type,
        },
        where: { id: cardId },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findOne(cardId: number) {
    try {
      return await this.prisma.card.findUnique({
        where: { id: cardId },
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async findByBankAccountId(bankAccountId: number) {
    try {
      return await this.prisma.card.findMany({
        where: { bank_account_id: bankAccountId },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findByUserId(userId: number) {
    try {
      return await this.prisma.card.findMany({
        include: { bank_account: true },
        where: { bank_account: { user_id: userId } },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async delete(cardId: number) {
    try {
      return await this.prisma.card.delete({
        where: { id: cardId },
      });
    } catch {
      throw new BadRequestException();
    }
  }
}
