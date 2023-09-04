import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateGoogleUserDto, CreateUserDto } from './dto/create-user-data.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserProvider } from 'src/common/types/user-provider.type';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  private HASH_SALT = 8;

  async hash(value: string, salt: number = this.HASH_SALT) {
    return bcrypt.hash(value, salt);
  }

  async compareHash(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const data = { ...createUserDto };

      if (data.password) data.password = await this.hash(data.password);
      return await this.prisma.user.create({
        data,
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async createGoogleUser(createGoogleUserDto: CreateGoogleUserDto) {
    try {
      return await this.prisma.user.create({
        data: { ...createGoogleUserDto, provider: 'GOOGLE' },
      });
    } catch (ex) {
      console.log(ex);
      throw new BadRequestException();
    }
  }

  async findById(id: number) {
    try {
      return await this.prisma.user.findUnique({ where: { id } });
    } catch {
      throw new BadRequestException();
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (ex) {
      throw new BadRequestException();
    }
  }

  async updateById(id: number, updateUserData: UpdateUserDto) {
    try {
      const data = { ...updateUserData };

      if (data.password) data.password = await this.hash(data.password);

      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    const data = { refresh_token: refreshToken };
    if (refreshToken) data.refresh_token = await this.hash(refreshToken);

    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data,
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async updateProvider(userId: number, provider: UserProvider) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: { provider },
      });
    } catch {
      throw new BadRequestException();
    }
  }
}
