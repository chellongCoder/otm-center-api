import { successResponse } from '@/helpers/response.helper';
import { UserWorkspaceClassTypes, UserWorkspaceClasses } from '@/models/user-workspace-classes.model';
import { UserWorkspaceClassesService } from '@/services/user-workspace-classes.service';
import { Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/user_workspace_classes')
export class UserWorkspaceClassesController {
  constructor(public service: UserWorkspaceClassesService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get user_workspace_classes list' })
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
  @Get('/timetable_by_date')
  @OpenAPI({ summary: 'Get user_workspace_classes list' })
  async getTimetableByDate(
    @QueryParam('userWorkspaceId') userWorkspaceId: string,
    @QueryParam('date') date: string,
    @QueryParam('workspaceId') workspaceId: string,
    @Res() res: any,
  ) {
    const data = await this.service.getTimetableByDate({
      userWorkspaceId,
      date,
      workspaceId,
    });
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/list')
  @OpenAPI({ summary: 'Get user_workspace_classes list by userWorkspaceId and status' })
  async findByFilter(@QueryParam('userWorkspaceId') userWorkspaceId: number, @QueryParam('status') status: string, @Res() res: any) {
    const data = await this.service.findByFilter(userWorkspaceId, status as UserWorkspaceClassTypes);
    console.log('chh_log ---> findByFilter ---> data:', data);
    return successResponse({ res, data, status_code: 200 });
  }

  @Get('/:id')
  @OpenAPI({ summary: 'Get user_workspace_classes by id' })
  async findById(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.findById(id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @OpenAPI({ summary: 'Create user_workspace_classes' })
  async create(@Body({ required: true }) body: UserWorkspaceClasses, @Res() res: any) {
    const data = await this.service.create(body);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update user_workspace_classes' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete user_workspace_classes' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
