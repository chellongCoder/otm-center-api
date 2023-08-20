import { UpdateClassLectureDto } from '@/dtos/update-class-lecture.dto';
import { successResponse } from '@/helpers/response.helper';
import { ClassLectures } from '@/models/class-lectures.model';
import { ClassLecturesService } from '@/services/class-lectures.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/class_lectures')
export class ClassLecturesController {
  constructor(public service: ClassLecturesService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get class_lectures list' })
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
  @OpenAPI({ summary: 'Get class_lectures by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @Authorized()
  @OpenAPI({ summary: 'Create class_lectures' })
  async create(@Body({ required: true }) body: ClassLectures, @Res() res: any) {
    const data = await this.service.create(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Update class_lectures' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Put('/timetable/:timetableId')
  @Authorized()
  @OpenAPI({ summary: 'Update class_lecture by timetable' })
  async updateClassLectureByTimetable(
    @Param('timetableId') timetableId: number,
    @Body({ required: true }) body: UpdateClassLectureDto,
    @Res() res: any,
  ) {
    const data = await this.service.updateClassLectureByTimetable(timetableId, body);
    return successResponse({ res, data, status_code: 200 });
  }

  @Delete('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Delete class_lectures' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
