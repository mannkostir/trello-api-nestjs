import { Exclude } from 'class-transformer';
import { CardsColumn } from 'src/columns/cardsColumn.entity';
import { Comment } from '../comments/comment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({ nullable: true })
  @Exclude()
  public hashedRefreshToken: string;

  @OneToMany(() => CardsColumn, (column: CardsColumn) => column.author)
  public columns: CardsColumn[];

  @OneToMany(() => Comment, (comment: Comment) => comment.author)
  public comments: Comment[];
}
