import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserData } from './types/create-user-data.type';
import { UpdateUserData } from './types/update-user.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserData: CreateUserData) {
    const user = new this.userModel(createUserData);
    try {
      await user.save();
    } catch {
      throw new BadRequestException();
    }
    return user;
  }

  async findById(id: string) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException();
    } catch {
      throw new BadRequestException();
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) throw new NotFoundException();
    } catch {
      throw new BadRequestException();
    }
  }

  async updateById(id: string, updateUserData: UpdateUserData) {
    try {
      return await this.userModel.updateOne(
        { _id: id },
        { $set: updateUserData },
      );
    } catch {
      throw new BadRequestException();
    }
  }
}
