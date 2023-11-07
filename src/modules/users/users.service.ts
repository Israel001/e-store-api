import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './users.dto';
import { User } from '../../schemas/user.schema';
import bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: CreateUserDto) {
    const existingUser = await this.userModel
      .findOne({ username: user.username })
      .exec();
    if (existingUser)
      throw new ConflictException(
        `Username: ${user.username} is already taken`,
      );
    const hashedPassword = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(12),
    );
    const createdUser = new this.userModel({
      name: user.name,
      username: user.username,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }
}
