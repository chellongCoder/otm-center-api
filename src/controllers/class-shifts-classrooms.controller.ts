import { CheckShiftClassroomValidDto } from '@/dtos/check-shift-classroom-valid.dto';
import { CreateShiftsClassroomsDto } from '@/dtos/create-class-shifts-classrooms.dto';
import { successResponse } from '@/helpers/response.helper';
import { ClassShiftsClassroomsService } from '@/services/class-shifts-classrooms.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Res } from 'routing-controllers';
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
  @Authorized()
  @OpenAPI({ summary: 'Get class_shifts_classrooms by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @Authorized()
  @OpenAPI({ summary: 'Create class_shifts_classrooms' })
  async create(@Body({ required: true }) body: CreateShiftsClassroomsDto, @Res() res: any) {
    const data = await this.service.create(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Post('/check_shift_classroom')
  @Authorized()
  @OpenAPI({ summary: 'check class_shifts_classrooms valid' })
  async checkShiftClassroomValid(@Body({ required: true }) body: CheckShiftClassroomValidDto, @Res() res: any) {
    const data = await this.service.checkShiftClassroomValid(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Update class_shifts_classrooms' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Delete class_shifts_classrooms' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
