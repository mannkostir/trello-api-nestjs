import { Card } from 'src/cards/card.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
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
  public author: User;

  @OneToMany(() => Card, (card: Card) => card.column)
  public cards: Card[];
}
