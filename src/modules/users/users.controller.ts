import { Controller, Get, Post, Body, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUserPayload } from 'src/common/types/user-payload.type';
import { CreateUserDto } from './dto/create-user-data.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@User() user: JwtUserPayload) {
    return user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.service.create(createUserDto);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(
    @User() user: JwtUserPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.service.updateById(user.id, updateUserDto);
  }
}
