import { Controller, Delete, Get, Param } from '@nestjs/common';
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

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    const user = await this.usersService.delete(id);
    return user;
  }
}
