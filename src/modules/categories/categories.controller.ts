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
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtUserPayload } from 'src/common/types/user-payload.type';
import { User } from 'src/common/decorators/user.decorator';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindCategoryByIdDto } from './dto/find-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @User() user: JwtUserPayload,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return await this.service.create(user.id, createCategoryDto);
  }

  @Patch(':categoryId')
  @UseGuards(JwtAuthGuard)
  async updateOne(
    @Param() { categoryId }: FindCategoryByIdDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.service.update(categoryId, updateCategoryDto);
  }

  @Get(':categoryId')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param() { categoryId }: FindCategoryByIdDto) {
    return await this.service.findOne(categoryId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findByUserId(@User() user: JwtUserPayload) {
    return await this.service.findByUserId(user.id);
  }

  @Delete(':categoryId')
  @UseGuards(JwtAuthGuard)
  async deleteOne(@Param() { categoryId }: FindCategoryByIdDto) {
    return await this.service.delete(categoryId);
  }
}
