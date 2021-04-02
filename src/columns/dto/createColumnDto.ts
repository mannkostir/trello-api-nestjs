import { IsNumber, IsString } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  name: string;

  @IsNumber()
  authorId: number;
}
