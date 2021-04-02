import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

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

    if (user) {
      return user;
    }

    throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    return user;
  }

  async create(userData: CreateUserDto) {
    const newUser = this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async update(userId: number, userData: UpdateUserDto) {
    await this.usersRepository.update({ id: userId }, userData);
  }

  async delete(userId: number) {
    const user = await this.usersRepository.findOne({ id: userId });
    await this.usersRepository.delete({ id: userId });
    return user;
  }

  async setRefreshToken(token: string, userId: number) {
    const hashedToken = await bcrypt.hash(token, 10);

    await this.usersRepository.update(
      { id: userId },
      { hashedRefreshToken: hashedToken },
    );
  }
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    const isRefreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (isRefreshTokenMatches) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      hashedRefreshToken: null,
    });
  }
}
