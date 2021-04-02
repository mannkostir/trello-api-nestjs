import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { IsDefined, ValidateNested } from 'class-validator';
import { Card } from 'src/cards/card.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CardsColumn {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToOne(() => User, (author: User) => author.columns)
  @ValidateNested()
  public author: User;

  @OneToMany(() => Card, (card: Card) => card.column)
  public cards: Card[];
}
