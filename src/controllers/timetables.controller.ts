import { GenerateTimetableDto } from '@/dtos/generate-timetable.dto';
import { successResponse } from '@/helpers/response.helper';
import { Timetables } from '@/models/timetables.model';
import { TimetablesService } from '@/services/timetables.service';
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/timetables')
export class TimetablesController {
  constructor(public service: TimetablesService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get timetables list' })
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

  @Get('/by_date')
  @OpenAPI({ summary: 'Get timetables list' })
  async findAllByDate(
    @QueryParam('fromDate') fromDate: number,
    @QueryParam('toDate') toDate: number,
    @QueryParam('userWorkspaceId') userWorkspaceId: number,
    @QueryParam('workspaceId') workspaceId: number,
    @Res() res: any,
  ) {
    const data = await this.service.findAllByDate(fromDate, toDate, userWorkspaceId, workspaceId);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/:id')
  @OpenAPI({ summary: 'Get timetables by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @OpenAPI({ summary: 'Create timetables' })
  async create(@Body({ required: true }) body: Timetables, @Res() res: any) {
    const data = await this.service.create(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update timetables' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete timetables' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/generate')
  @OpenAPI({ summary: 'Generate timetables from user_workspace_shift_scopes and classes' })
  async generate(@Body({ required: true }) body: GenerateTimetableDto, @Res() res: any) {
    const data = await this.service.generate(body);
    return successResponse({ res, data, status_code: 201 });
  }
}
