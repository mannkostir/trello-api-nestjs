import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    const users = await this.usersService.getAll();
    return users;
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    const user = await this.usersService.getById(id);
    return user;
  }

  @Post()
  async createUser(@Body() userData: CreateUserDto) {
    const user = await this.usersService.create(userData);
    return user;
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {}

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    const user = await this.usersService.delete(id);
    return user;
  }
}
