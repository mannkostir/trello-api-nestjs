import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getAll() {
    const users = await this.usersRepository.find();
    return users;
  }

  async getById(userId: number) {
    const user = await this.usersRepository.findOne({ id: userId });
    return user;
  }

  async create(userData: CreateUserDto) {
    const newUser = this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async delete(userId: number) {
    const user = await this.usersRepository.findOne({ id: userId });
    await this.usersRepository.delete(user);
    return user;
  }
}
