import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: number, createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: { ...createCategoryDto, user_id: userId },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async update(categoryId: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        data: updateCategoryDto,
        where: { id: categoryId },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findOne(categoryId: number) {
    try {
      return await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async findByUserId(userId: number) {
    try {
      return await this.prisma.category.findMany({
        where: { user_id: userId },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async delete(categoryId: number) {
    try {
      return await this.prisma.category.delete({
        where: { id: categoryId },
      });
    } catch {
      throw new BadRequestException();
    }
  }
}
