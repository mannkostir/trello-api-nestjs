import { Card } from 'src/cards/card.entity';
import { User } from 'src/users/user.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Card, (card: Card) => card.comments)
  card: Card;

  @ManyToOne(() => User, (author: User) => author.comments)
  author: User;
}
