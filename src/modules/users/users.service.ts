import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserData } from './types/create-user-data.type';
import { UpdateUserData } from './types/update-user.type';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserData: CreateUserData) {
    try {
      return await this.prisma.user.create({ data: createUserData });
    } catch {
      throw new BadRequestException();
    }
  }

  async findById(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException();
    } catch {
      throw new BadRequestException();
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new NotFoundException();
    } catch {
      throw new BadRequestException();
    }
  }

  async updateById(id: number, updateUserData: UpdateUserData) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserData,
      });
    } catch {
      throw new BadRequestException();
    }
  }
}
