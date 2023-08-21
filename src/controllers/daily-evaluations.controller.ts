import { successResponse } from '@/helpers/response.helper';
import { DailyEvaluations } from '@/models/daily-evaluations.model';
import { DailyEvaluationsService } from '@/services/daily-evaluations.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/daily_evaluations')
export class DailyEvaluationsController {
  constructor(public service: DailyEvaluationsService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get daily_evaluations list' })
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
  @OpenAPI({ summary: 'Get daily_evaluations by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/class/:id')
  @Authorized()
  @OpenAPI({ summary: 'Get daily_evaluations of class by class_id' })
  async getDailyEvaluationByClassId(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.getDailyEvaluationByClassId(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @Authorized()
  @OpenAPI({ summary: 'Create daily_evaluations' })
  async create(@Body({ required: true }) body: DailyEvaluations, @Res() res: any) {
    const data = await this.service.create(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Update daily_evaluations' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Delete daily_evaluations' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
