import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUsers(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto);
    return user.save();
  }
  async findAllUsers() {
    const users = this.userModel.find();
    return users;
  }
  async findUser(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('could not find the user');
    return user;
  }
  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }
  removeUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
