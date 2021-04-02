import { IsString } from 'class-validator';

export class UpdateColumnDto {
  @IsString()
  name?: string;
}
