import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsColumn } from './cardsColumn.entity';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';

@Module({
  imports: [TypeOrmModule.forFeature([CardsColumn])],
  controllers: [ColumnsController],
  providers: [ColumnsService],
})
export class ColumnsModule {}
