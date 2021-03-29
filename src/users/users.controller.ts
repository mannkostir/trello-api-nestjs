import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers() {
    const users = await this.usersService.getAll();
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: number) {
    const user = await this.usersService.getById(id);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    const user = await this.usersService.delete(id);
    return user;
  }
}
