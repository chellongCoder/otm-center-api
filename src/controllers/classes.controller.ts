import { successResponse } from '@/helpers/response.helper';
import { Classes, StatusClasses } from '@/models/classes.model';
import { ClassesService } from '@/services/classes.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/classes')
export class ClassesController {
  constructor(public service: ClassesService) {}

  @Get('/')
  @Authorized()
  @OpenAPI({ summary: 'Get classes list' })
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

  @Get('/owner-teacher')
  @Authorized()
  @OpenAPI({ summary: 'Get lớp học' })
  async getOwnerClasses(
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number,
    @QueryParam('order') order: string,
    @QueryParam('search') search: string,
    @QueryParam('status', { type: 'string' }) status: StatusClasses,
    @Res() res: any,
  ) {
    const data = await this.service.findAllClasses(page, limit, order, search, status);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Get classes by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/:id/schedule')
  @Authorized()
  @OpenAPI({ summary: 'Get lịch học' })
  async getClassSchedule(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.getClassSchedule(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @Authorized()
  @OpenAPI({ summary: 'Create classes' })
  async create(@Body({ required: true }) body: Classes, @Res() res: any) {
    const data = await this.service.create(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Update classes' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Delete classes' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
