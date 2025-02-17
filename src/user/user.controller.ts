import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUsers(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAllUsers();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findUser(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.removeUser(id);
  }
}
