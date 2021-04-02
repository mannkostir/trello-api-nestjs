import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RequestWithUser } from 'src/auth/interfaces/requestWithUsers.interface';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { UserAuthGuard } from 'src/users/userAuth.guard';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/createColumnDto';
import { UpdateColumnDto } from './dto/updateColumnDto';

@Controller('users/:userId/columns')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Get()
  async getAllColumns(@Req() request: RequestWithUser) {
    const columns = await this.columnsService.getUsersColumn(request.user.id);

    return columns;
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    const columns = await this.columnsService.getById(id);

    return columns;
  }

  @Post()
  async create(@Body() columnData: CreateColumnDto) {
    const column = await this.columnsService.create(columnData);

    return column;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateData: UpdateColumnDto,
    @Req() req: RequestWithUser,
  ) {
    const column = await this.columnsService.update(
      id,
      req.user.id,
      updateData,
    );

    return column;
  }

  @Delete('id')
  async deleteOne(@Param('id') id: number) {
    const column = await this.columnsService.deleteOne(id);

    return column;
  }
}
