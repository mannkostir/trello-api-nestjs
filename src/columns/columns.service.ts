import {
  ClassSerializerInterceptor,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardsColumn } from './cardsColumn.entity';
import { CreateColumnDto } from './dto/createColumnDto';
import { UpdateColumnDto } from './dto/updateColumnDto';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(CardsColumn)
    private columnRepository: Repository<CardsColumn>,
  ) {}

  async getAll() {
    const columns = await this.columnRepository.find();
    return columns;
  }

  async getUsersColumn(userId: number) {
    const columns = await this.columnRepository.find({
      author: { id: userId },
    });

    return columns;
  }

  async getById(id: number) {
    const column = await this.columnRepository.findOne(
      { id },
      { relations: ['author'] },
    );
    return column;
  }

  async create(columnData: CreateColumnDto) {
    const newColumn = this.columnRepository.create({
      ...columnData,
      cards: [],
    });
    await this.columnRepository.save(newColumn);

    return newColumn;
  }

  async update(id: number, userId: number, updateData: UpdateColumnDto) {
    const targetColumn = await this.columnRepository.findOne(
      { id },
      { relations: ['author'] },
    );

    if (targetColumn.author?.id && targetColumn.author.id !== userId) {
      throw new ForbiddenException();
    }

    await this.columnRepository.update({ id }, updateData);

    const result = await this.columnRepository.findOne(id, {
      relations: ['author'],
    });

    return result;
  }

  async deleteOne(id: number) {
    const column = await this.columnRepository.findOne({ id });
    await this.columnRepository.delete({ id });

    return column;
  }
}
