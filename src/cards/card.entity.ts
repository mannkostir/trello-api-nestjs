import { CardsColumn } from 'src/columns/cardsColumn.entity';
import { Comment } from 'src/comments/comment.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => CardsColumn, (column: CardsColumn) => column.cards)
  column: CardsColumn;

  @OneToMany(() => Comment, (comment: Comment) => comment.card)
  comments: Comment[];
}
