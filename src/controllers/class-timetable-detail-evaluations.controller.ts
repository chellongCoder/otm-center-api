import { successResponse } from '@/helpers/response.helper';
import { ClassTimetableDetailEvaluations } from '@/models/class-timetable-detail-evaluations.model';
import { ClassTimetableDetailEvaluationsService } from '@/services/class-timetable-detail-evaluations.service';
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/class_timetable_detail_evaluations')
export class ClassTimetableDetailEvaluationsController {
  constructor(public service: ClassTimetableDetailEvaluationsService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get class_timetable_detail_evaluations list' })
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
  @OpenAPI({ summary: 'Get class_timetable_detail_evaluations by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @OpenAPI({ summary: 'Create class_timetable_detail_evaluations' })
  async create(@Body({ required: true }) body: ClassTimetableDetailEvaluations, @Res() res: any) {
    const data = await this.service.create(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update class_timetable_detail_evaluations' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete class_timetable_detail_evaluations' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
