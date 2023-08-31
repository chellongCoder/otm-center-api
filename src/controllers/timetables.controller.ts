import { MobileContext } from '@/auth/authorizationChecker';
import { GenerateTimetableDto } from '@/dtos/generate-timetable.dto';
import { successResponse } from '@/helpers/response.helper';
import { PermissionKeys } from '@/models/permissions.model';
import { Timetables } from '@/models/timetables.model';
import { TimetablesService } from '@/services/timetables.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/timetables')
export class TimetablesController {
  constructor(public service: TimetablesService) {}

  @Get('/')
  @Authorized()
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
  @Authorized([PermissionKeys.STUDENT])
  @OpenAPI({ summary: 'Get timetables list' })
  async findAllByDate(
    @QueryParam('fromDate') fromDate: number,
    @QueryParam('toDate') toDate: number,
    @QueryParam('userWorkspaceId') userWorkspaceId: number,
    @QueryParam('workspaceId') workspaceId: number,
    @Res() res: any,
    @Req() req: any,
  ) {
    const { user_workspace_context, workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.findAllByDate(
      fromDate,
      toDate,
      userWorkspaceId || user_workspace_context.id,
      workspaceId || workspace_context.id,
    );
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/teacher/:id')
  @Authorized()
  @OpenAPI({ summary: 'Get timetables by id' })
  async findByIdTeacher(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findByIdTeacher(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/student/:id')
  @Authorized()
  @OpenAPI({ summary: 'Get timetables by id' })
  async findByIdStudent(@Param('id') id: number, @Res() res: any, @Req() req: any) {
    const { user_workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.findByIdStudent(id, user_workspace_context.id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @Authorized()
  @OpenAPI({ summary: 'Create timetables' })
  async create(@Body({ required: true }) body: Timetables, @Res() res: any) {
    const data = await this.service.create(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Update timetables' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @Authorized()
  @OpenAPI({ summary: 'Delete timetables' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/generate')
  @Authorized()
  @OpenAPI({ summary: 'Generate timetables from user_workspace_shift_scopes and classes' })
  async generate(@Body({ required: true }) body: GenerateTimetableDto, @Res() res: any) {
    const data = await this.service.generate(body);
    return successResponse({ res, data, status_code: 201 });
  }
}
