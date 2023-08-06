import { CheckShiftClassroomValidDto } from '@/dtos/check-shift-classroom-valid.dto';
import { successResponse } from '@/helpers/response.helper';
import { ClassShiftsClassrooms } from '@/models/class-shifts-classrooms.model';
import { ClassShiftsClassroomsService } from '@/services/class-shifts-classrooms.service';
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/class_shifts_classrooms')
export class ClassShiftsClassroomsController {
  constructor(public service: ClassShiftsClassroomsService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get class_shifts_classrooms list' })
  async findAll(
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number,
    @QueryParam('order') order: string,
    @QueryParam('search') search: string,
    @Res() res: any,
  ) {
    const data = await this.service.findAll(page, limit, order, search);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/:id')
  @OpenAPI({ summary: 'Get class_shifts_classrooms by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @OpenAPI({ summary: 'Create class_shifts_classrooms' })
  async create(@Body({ required: true }) body: ClassShiftsClassrooms, @Res() res: any) {
    const data = await this.service.create(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Post('/check_shift_classroom')
  @OpenAPI({ summary: 'check class_shifts_classrooms valid' })
  async checkShiftClassroomValid(@Body({ required: true }) body: CheckShiftClassroomValidDto, @Res() res: any) {
    const data = await this.service.checkShiftClassroomValid(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update class_shifts_classrooms' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete class_shifts_classrooms' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
